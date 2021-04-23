/**
 * Script for Tic Tac Toe
 */

// Create an element that we will duplicate inside the canvas
const pixel1 = document.createElement('div');
pixel1.classList.add('square-div');
// Fill up the canvas with the square element we made
for (let i = 0; i < sideNumber * sideNumber; i++) {
  canvas1.appendChild(pixel1.cloneNode(true));
}

// Create a module for gameBoard
const gameBoard = (() => {
    let boardSize = {
        rows: 3,
        columns: 3
    };

    const makeGameBoard = (numberOfRows) => {
        // Reset board to empty array
        let tempBoard = [];
        // Add an empty array to `board` for each row
        for (let i = 0; i < numberOfRows; i ++) {
            tempBoard.push( [] );
        }
        return tempBoard;
    }

    let board = makeGameBoard(boardSize["rows"]);
    // Function for testing if board changes are persistent
    const change = () => {
        board[0][0] = 1;
    }

    const clear = () => {
        board = makeGameBoard(boardSize["rows"]);
    };

    const displayGameBoard = () => {
        // Create sections for the o's and x's
        let gameBoardSquare = document.createElement("section");
        gameBoardSquare.classList.add("square");
        // Add sections to the gameboard if needed
        let gameBoardSection = document.getElementById("game-board");

        // Fill in the sections with array if possible
    }

    const getGameBoard = () => board;
    const size = () => boardSize;

    return{
        clear,
        change,
        getGameBoard,
        size
    }
})();

// Testing functions
gameBoard.getGameBoard();
gameBoard.change();
gameBoard.getGameBoard();
gameBoard.clear();
gameBoard.getGameBoard();

// Write a method that displays the array onto the html elements

// Create a factory for players
const PlayerFactory = (name) => {
    const getName = () => name;

    return {
        getName
    }
};

// Create a module for game logic
const gameLogic = (() => {
}