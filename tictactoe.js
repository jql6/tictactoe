/**
 * Script for Tic Tac Toe
 */


// Used make sure that the chosen marker is a single letter
function isLetter(string1) {
    let letters = /^[A-Za-z]$/;
    return (String(string1).match(letters)) ? true : false
}


const gameBoard = (() => {
    let size = {
        rows: 3,
        columns: 3
    };
    const getSize = () => size;

    const initialize = (size) => {
        // Size is a dictionary with keys for "rows" and "columns"
        let tempBoard = [];
        // Create an array of array of 0's when given the dimensions
        for (let i = 0; i < size["rows"]; i++) {
            let rowArray = [];
            for (let j = 0; j < size["columns"]; j++) {
                rowArray.push(0);
            }
            tempBoard.push( rowArray );
        }
        return tempBoard;
    }

    let board = initialize(size);
    const getGameBoard = () => board;

    // Function used for changing elements in the board array
    const change = (marker, position) => {
        let rowIndex = parseInt(position["row"]) - 1;
        let columnIndex = parseInt(position["column"]) - 1;

        board[rowIndex][columnIndex] = marker;
    }
    // Reset the board array
    const clear = () => {
        board = initialize(size);
    };

    return{
        clear,
        change,
        initialize,
        getGameBoard,
        getSize
    }
})();


// Module for changing the display
const gameDisplay = (() => {
    const initialize = (gameBoardObject) => {
        // Highlight first player because they have the first turn
        let player1 = document.getElementById("player1");
        player1.classList.add("selected");
        // Add sections to the gameboard if needed
        let gameBoardSection = document.getElementById("game-board");
        // Change grid style based on number of columns
        gameBoardSection.style.gridTemplateColumns =
                `repeat(${gameBoardObject.getSize()["columns"]}, 1fr)`;
        // Create section to copy
        let gameBoardSquare = document.createElement("section");
        gameBoardSquare.classList.add("square");

        // Fill in the sections with array if possible
        for (let i = 0; i < gameBoardObject.getSize()["rows"]; i++) {
            for (let j = 0; j < gameBoardObject.getSize()["columns"]; j++) {
                let tempSquare = gameBoardSquare.cloneNode(true);
                tempSquare.setAttribute("data-row", i + 1);
                tempSquare.setAttribute("data-column", j + 1);
                tempSquare.addEventListener('click', clickPosition);
                gameBoardSection.appendChild(tempSquare);
            }
        }

        // Add forms for players to change their names
        for (let i = 1; i < 3; i++) {
            let inputDict = {
                forAttribute: ["player" + i],
                label: ["Name"],
                inputType: ["text"],
                maxLength: ["10"],
                placeholder: ["Player " + i],
                required: [true]
            };

            // Create the form in html
            playerForm = document.createElement("form");
            playerForm.id = "player-form" + i;
            playerForm.style.zIndex = "1";
            playerForm.setAttribute("onsubmit", "return false");
            // Loop through the different fields we want
            for (let j = 0; j < inputDict["label"].length; j++) {
                // Label
                let inputLabel = document.createElement("label");
                inputLabel.setAttribute("for", inputDict["forAttribute"][j]);
                inputLabel.appendChild(document.createElement("b"));
                inputLabel.firstElementChild.textContent =
                        inputDict["label"][j];
                playerForm.appendChild(inputLabel);
                // Input
                let inputField = document.createElement("input");
                inputField.setAttribute("type", inputDict["inputType"][j]);
                inputField.setAttribute("placeholder",
                                        inputDict["placeholder"][j]);
                inputField.setAttribute("name", inputDict["forAttribute"][j]);
                inputField.required = inputDict["required"][j];
                playerForm.appendChild(inputField);
            }

            // Select the pop-up-container section
            let playerID = "player" + i + "-form";
            let playerElement = document.getElementById(
                playerID
            );
            // Append it to the pop-up-container
            playerElement.appendChild(playerForm);

            // Creating the save button row for saving name changes
            let saveLabel = document.createElement("label");
            let boldedText = document.createElement("b");
            boldedText.textContent = "Save?";
            saveLabel.appendChild(boldedText);
            playerForm.appendChild(saveLabel);

            let saveButton = document.createElement("button");
            saveButton.textContent = "save";
            saveButton.classList.add("player-form-save");
            playerForm.appendChild(saveButton);
        }

        // Add event listener to reset button
        let resetButton = document.getElementById("reset");
        resetButton.addEventListener('click', resetGame);
        let saveButtons = document.getElementsByClassName("player-form-save");
        Array.from(saveButtons).forEach(saveButton => {
            saveButton.addEventListener('click', updatePlayerDisplay);
        });
    }
    // Make the marks appear on the board display
    const markSquare = (markSymbol, position) => {
        let selectedSquare = document.querySelector(
            `section[data-row="${position["row"]}"]` + 
            `[data-column="${position["column"]}"]`
        );
        selectedSquare.textContent = markSymbol;
    }
    // Event listener that gives gameLogic code the clicked coordinates
    const clickPosition = (e) => {
        let position = {
            row: e.target.getAttribute("data-row"),
            column: e.target.getAttribute("data-column")
        };
        gameLogic.doTurn(position);
    }
    // Used to prevent further board changes after someone wins
    const removeEventListeners = () => {
        // Remove event listeners from panel
        let squares = document.getElementsByClassName("square");
        let squareArray = Array.from(squares);

        squareArray.forEach(square => {
            square.removeEventListener("click", clickPosition);
        });
    }
    // Used to show who's turn it currently is
    const highlightCurrentPlayer = (playerIndex) => {
        let playerNumber = playerIndex + 1;
        let players = document.getElementsByClassName("player");
        let playerArray = Array.from(players);
        let currentPlayer = document.getElementById(
            "player" + String(playerNumber)
        );
        playerArray.forEach(player => {
            player.classList.remove("selected");
        });
        currentPlayer.classList.add("selected");
    }
    // Used to show who won
    const spinPlayer = (playerIndex) => {
        let playerNumber = playerIndex + 1;
        let currentPlayer = document.getElementById(
            "player" + String(playerNumber)
        );
        currentPlayer.classList.add("spinning");
    }
    // Used to reset the player highlighting and spinning names
    const clear = () => {
        let squares = document.getElementsByClassName("square");
        Array.from(squares).forEach(square => {
            square.textContent = "";
            square.addEventListener('click', clickPosition);
        });
        let players = document.getElementsByClassName("player");
        Array.from(players).forEach(player => {
            player.classList.remove("spinning");
        });
    }

    const resetGame = () => {
        gameLogic.resetGame();
    }
    // Click event that change the displayed player name
    const updatePlayerDisplay = (e) => {
        let playerID = e.target.parentNode.parentNode.parentNode.id;
        let selectedPlayer = document.getElementById(playerID);
        let newName = selectedPlayer.querySelector(
            `input[name='${playerID}']`
        ).value;
        selectedPlayer.firstElementChild.textContent = newName;
    }

    return {
        clear,
        highlightCurrentPlayer,
        initialize,
        markSquare,
        removeEventListeners,
        spinPlayer
    }
})();


const gameLogic = (() => {
    let players = [];

    const getPlayers = () => players;
    const setPlayers = (playerArray) => {
        // Coerce single inputs into an array if possible
        players = Array.from(playerArray);
        // Update player displays

    }

    let turnsCompleted = 0;
    const getTurnsCompleted = () => turnsCompleted;

    let currentPlayerIndex = 0;
    const getCurrentPlayerIndex = () => currentPlayerIndex;

    let currentPlayer = players[currentPlayerIndex];

    const updateCurrentPlayer = () => {
        currentPlayerIndex = (players.length == 0) ?
                0: turnsCompleted % players.length;
        currentPlayer = players[currentPlayerIndex];
    }
    const getCurrentPlayer = () => {
        updateCurrentPlayer();
        return currentPlayer
    }

    const gameOver = () => {
        // Print message
        console.log("game over!");
        gameDisplay.removeEventListeners();
    }
    // Most of the game logic after a player clicks a square
    const doTurn = (clickedPosition) => {
        let marker = gameLogic.getCurrentPlayer().getMarker();
        let clickRowIndex = parseInt(clickedPosition["row"]) - 1;
        let clickColumnIndex = parseInt(clickedPosition["column"]) - 1;
        // Check if square is already occupied
        let clickedElement = gameBoard.getGameBoard()[clickRowIndex]
                [clickColumnIndex];
        
        if (clickedElement == 0) {
            turnsCompleted += 1;
            gameBoard.change(marker, clickedPosition);
            gameDisplay.markSquare(marker, clickedPosition);
            if (check3InARow() == true) {
                // Add spinning element to winning player's name
                gameDisplay.spinPlayer(gameLogic.getCurrentPlayerIndex());
                gameOver();
            }
            else{
                updateCurrentPlayer();
                gameDisplay.highlightCurrentPlayer(currentPlayerIndex);
            }
            // Change the UI to reflect current player's turn
        }
        else{
            console.log("This square is already occupied!");
            // apply some sort of css animation to show that it's occupied
        }
    }

    const resetGame = () => {
        // Reset game board
        gameBoard.clear();
        gameDisplay.clear();
        // Reset player highlighting
        turnsCompleted = 0;
        currentPlayerIndex = 0;
        gameDisplay.highlightCurrentPlayer(currentPlayerIndex);
    }
    // Checks an array of three to see if they match and aren't 0
    const is3InARow = (arrayOf3) => {
        let result = true;
        let firstElement = arrayOf3[0];
        arrayOf3.forEach(element => {
            // Check that elements match and that they're not placeholder 0's
            if (element == 0 || element != firstElement) {
                result = false;
            }
        });
        return result;
    }

    const check3InARow = () => {
        let gameOver = false;
        let currentBoard = gameBoard.getGameBoard();
        // Check horizontals
        currentBoard.forEach(row => {
            if (is3InARow(row)) {
                gameOver = true;
            }
        });
        // Check verticals
        for (let j = 0; j < gameBoard.getSize()["columns"]; j++) {
            let column = [];
            for (let i = 0; i < gameBoard.getSize()["rows"]; i++) {
                column.push(currentBoard[i][j]);
            }
            if (is3InARow(column)) {
                gameOver = true;
            }
        }
        // Check diagonals (assuming board is 3x3 square)
        let topLeftDiagonal = [];
        let topRightDiagonal = [];
        for (let i = 0; i < gameBoard.getSize()["rows"]; i++) {
            let oppositeIndex = (parseInt(gameBoard.getSize()["columns"])
                    - 1) - i;
            // Value for topLeftDiagonal
            topLeftDiagonal.push(currentBoard[i][i]);
            // Value for topRightDiagonal
            topRightDiagonal.push(currentBoard[oppositeIndex][i]);
        }

        if (is3InARow(topLeftDiagonal)) {
            gameOver = true;
        }
        if (is3InARow(topRightDiagonal)) {
            gameOver = true;
        }

        return gameOver;
    }

    return{
        doTurn,
        getCurrentPlayer,
        getCurrentPlayerIndex,
        getPlayers,
        getTurnsCompleted,
        resetGame,
        setPlayers,
        updateCurrentPlayer
    }
})();

// Create a factory for players
const PlayerFactory = (name, marker) => {
    const getMarker = () => marker;
    const setMarker = (newMarker) => {
        if (isLetter(newMarker)) {
            marker = newMarker;
        }
        else {
            alert("Error, marker must be a single letter!");
        }
    }
    const getName = () => name;
    const setName = (newName) => {
        name = newName;
    }

    return {
        getMarker,
        getName,
        setMarker,
        setName
    }
};

// Initial code
let p1 = PlayerFactory("Player 1", "X");
let p2 = PlayerFactory("Player 2", "O");
gameLogic.setPlayers([p1, p2]);
gameDisplay.initialize(gameBoard);

/**
 * Resources
 * 
 * Function for checking if the input is a letter
 * https://www.w3resource.com/javascript/form/all-letters-field.php
 */