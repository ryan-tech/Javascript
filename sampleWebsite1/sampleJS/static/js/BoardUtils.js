// File: BoardUtils.js
// Author: Ryan Kim
// Date: October 29, 2020
// Runs the tic tac toe game.

/*
Class: Game
Purpose: Holds the board, player 1's shape choice, and helper methods

*/
class Game {
    constructor() {
        this.board = createArray();
        this.p1Shape = 'O';
        this.p2Shape = 'X';
        this.currentPlayer = 1;
    }
    // returns 1 if player 1 wins, 2 if player 2 wins, 0 if tie, and -1 if game is not done.
    isOver() {
        //Cases: 3 rows, 3 columns, 2 diagonals, check if board is full


        var boardFull = true;
        var indices;
        var i, j;

        for (i = 0; i < 3; i++) {
            // Checks each row

            if (this.isVictory([[i,0],[i,1],[i,2]])) {
                console.log('Row ' + i);
                return this.board[i][0];
            }

            // checks each column
            if (this.isVictory([[0,i],[1,i],[2,i]])) {
                console.log('Column ' + i);
                return this.board[0][i];
            }

            //checks if board is full
            for (j = 0; j < 3; j++) {
                if (this.board[i][j] === 0) {

                    boardFull = false;
                }
            }

        }
        //checks diagonal from top left to bottom right
        if (this.isVictory([[0,0],[1,1],[2,2]])) {
            console.log('Diagonal 1');
            return this.board[0][0];
        }
        //checks diagonal from top right to bottom left

        if (this.isVictory([[2,0],[1,1],[0,2]])) {
            console.log('Diagonal 2');
            return this.board[2][0];
        }

        // wait til checking all of the victory cases before returning a tie result
        if (boardFull) {
            console.log('Board is full.')
            return 0;
        }

        return -1; // made it to the end without passing the end cases.
    }
    isVictory(indices) {
        // index = [0, 1, 2]
        // 1 : x,y
        // 2 : x,y
        // 3 : x,y
        // Had to break up comparisons because true && true && true -> false

        var nonZero = (this.board[indices[0][0]][indices[0][1]] + this.board[indices[1][0]][indices[1][1]] + this.board[indices[2][0]][indices[2][1]] > 0);
        let comparison1 = this.board[indices[0][0]][indices[0][1]] === this.board[indices[1][0]][indices[1][1]];
        let comparison2 = this.board[indices[1][0]][indices[1][1]] === this.board[indices[2][0]][indices[2][1]];
        let comparison3 = comparison1 && comparison2;


        if (nonZero && comparison3) {
            return true;
        }

        return false;
    }
}

// Create a new game
var newGame = new Game();


/*
Function: createArray
Purpose: Creates nxn array
Parameters: n, n, ... (nxn)
Return: Created array
*/
function createArray() {
    return [[0,0,0],[0,0,0],[0,0,0]];    // Initialize a 3x3 array to store the current state of the game
}



/*
Function: runGame()
Purpose: Gets player 1's shape, and initializes the tic tac toe array
Params: player 1's shape
Return: None
*/
function runGame(shape){

    var currentTurn = 0;    // Initialize the current turn to 0
    var mousePosX, mousePosY;
    var board = document.getElementById("Board"); // board element
    var boardCtx = board.getContext("2d");        // canvas context
    var htmlString = 'Player 1\'s shape is ' + shape + '. Please mark a square.';
    // set player 1's shape
    newGame.p1Shape = shape;
    // set player 2's shape
    (newGame.p1Shape === 'O') ? newGame.p2Shape = 'X' : newGame.p2Shape = 'O';
    // Change status
    document.getElementById('Status').innerHTML = htmlString;
    console.log('Adding event listener');
    // Listen for mouse down event on the canvas
    board.addEventListener("mousedown", handleMouseClick);
    console.log('Added event listener');


}

/*
Function: handleMouseClick
Purpose: performs the calculations with every mouse click
Params: event
Return: none
*/
function handleMouseClick(event) {
    let board = document.getElementById("Board");
    if (newGame.isOver() === -1) { // game hasn't ended yet
        // Get which square the mouse clicked on
        let [squareX, squareY] = getSquare(board, event);
        // If the square is vacant
        if (newGame.board[squareX][squareY] === 0) {

            // Mark it with currentPlayer
            newGame.board[squareX][squareY] = newGame.currentPlayer;

            // Update status message
            var statusMsg = 'It is now player ' + newGame.currentPlayer + '\'s turn.';
            document.getElementById('Status').innerHTML = statusMsg

            // Debug messages
            console.log(newGame.board)
            console.log('Game is not over.');

            // Draw shapes on the board
            (newGame.currentPlayer === 1) ? placeShapeAt(newGame.p1Shape, [squareX, squareY]) : placeShapeAt(newGame.p2Shape, [squareX, squareY]);

            // Switch Player
            (newGame.currentPlayer === 1) ? newGame.currentPlayer = 2 : newGame.currentPlayer = 1;

            // Check if the game has ended after the last turn.
            if (newGame.isOver() != -1) {
                var statusMsg = 'Game over!'
                if (newGame.isOver() === 0) {
                    statusMsg += ' The game is tied.';
                }
                else {
                    statusMsg += ' Player ' + newGame.isOver() + ' won.';
                }
                document.getElementById('Status').innerHTML = statusMsg;
                // Remove the event listener from canvas

                board.removeEventListener("mousedown", handleMouseClick)
            }
        }
    }
}

/*
Function: placeShapeAt()
Purpose: Places a shape in the appropriate square
Params: Shape (char), index (coordinate pair)
Return: None
*/
function placeShapeAt(shape, index) {
    // Get the canvas
    let board = document.getElementById("Board");
    let boardCtx = board.getContext("2d");        // canvas context
    var xCoord, yCoord;

    // Convert index to coordinates on the canvas
    yCoord = index[1]*(board.width/3) + board.width/6 // divide by 3 because 3 squares in a row and divide by 2 to get in the center
    xCoord = index[0]*(board.width/3) + board.height/6

    if (shape == 'O') {
        boardCtx.beginPath();
        // draw circle at index
        boardCtx.arc(xCoord, yCoord, board.height/8, 0, 2*Math.PI);
        boardCtx.stroke()
    }
    else {
        let ratio = 12;
        // draw X at index
        boardCtx.beginPath();
        boardCtx.moveTo(xCoord + board.height/ratio*Math.sqrt(2), yCoord + board.height/ratio*Math.sqrt(2));  // + +
        boardCtx.lineTo(xCoord - board.height/ratio*Math.sqrt(2), yCoord - board.height/ratio*Math.sqrt(2));  // - -
        boardCtx.stroke();

        boardCtx.beginPath();
        boardCtx.moveTo(xCoord + board.height/ratio*Math.sqrt(2), yCoord - board.height/ratio*Math.sqrt(2));  // + -
        boardCtx.lineTo(xCoord - board.height/ratio*Math.sqrt(2), yCoord + board.height/ratio*Math.sqrt(2));  // - +
        boardCtx.stroke();

    }
}



/*
Function: getSquare()
Purpose: Handles the mousedown event
Params: None
Return: None
*/
function getSquare(canvas, event) {
    console.log('getSquare Called')
    var rect = canvas.getBoundingClientRect();

    // Get relative position
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;


    // x is [0,300]
    // we want it to go to [0,2]
    // e.g. x = 160
    // floor(x / ((width)/3))

    // Convert it into square indices
    let squareX = Math.floor(x/(canvas.width/3))
    let squareY = Math.floor(y/(canvas.height/3))

    // Sanitize it (clamp values)
    squareX = clamp(squareX, 0, 2);
    squareY = clamp(squareY, 0, 2);

    return [squareX, squareY]
}

/*
Function: clamp()
Purpose: clamps value between a min and max
Params: value, min, max
Return: clamped value
*/
function clamp(val, min, max) {
    if (val > max)
        return max;
    else if (val < min)
        return min;
    else
        return val;
}



/*
Function: initBoard()
Purpose: Draws the board and initializes the game logic
Params: None
Return: None
*/
function initBoard() {


    // local variables

    var board = document.getElementById("Board");       // the canvas element from html
    var boardCtx = board.getContext("2d");                  // board context to draw on

    // Board Dimensions: side = 300px
    var i, j; //  for loop iterator

    // clears the board values
    for (i = 0; i < 3; i++) {
        for (j = 0; j < 3; j++) {
            newGame.board[i][j] = 0;
        }
    }

    for (i = 1; i <= 2; i++) {
        // Drawing Horizontal Lines
        boardCtx.beginPath();
        boardCtx.moveTo(i*board.width/3, 0);
        boardCtx.lineTo(i*board.width/3, board.height);
        boardCtx.stroke();

        // Drawing Vertical Lines
        boardCtx.beginPath();
        boardCtx.moveTo(0, i*board.height/3);
        boardCtx.lineTo(board.width, i*board.height/3);
        boardCtx.stroke();

    }
}

/*
Function: clear
Purpose: clears the canvas of any drawings
Params: None
Return: None
*/
function clear(){
    var board = document.getElementById("Board");
    var boardCtx = board.getContext("2d");
    boardCtx.clearRect(0, 0, board.width, board.height);
}

/*
Function: reset
Purpose: clears the board and resets the game
Params: None
Return: None
*/
function reset(){
    let defaultHTML = "Player 1: Select a Shape.    <button onclick=\"runGame(\'O\')\" type=\"button\">O</button> <button onclick=\"runGame(\'X\')\" type=\"button\">X</button><br>";
    let board = document.getElementById("Board");

    // clear the canvas of any drawings
    clear();

    // Redraw the grid
    initBoard();

    // Set the current player back to player 1
    newGame.currentPlayer = 1;

    // Set the status
    document.getElementById('Status').innerHTML = defaultHTML;

    // Stop listening for mouse clicks
    board.removeEventListener("mousedown", handleMouseClick);
}