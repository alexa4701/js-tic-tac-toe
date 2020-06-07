'use strict';

(function() {
    // Controls the game board and spaces
    const GameBoard = (function() {
        // Board space factory function
        let space = function(row, column) {
            let move = '';
            let taken = false;
            return {row, column, move, taken};
        }

        let board = [];



        // console.log(board);

        return {
            initBoard: function() {
                board.push(space('top', 'left'));
                board.push(space('top', 'middle'));
                board.push(space('top', 'right'));
                board.push(space('center', 'left'));
                board.push(space('center', 'middle'));
                board.push(space('center', 'right'));
                board.push(space('bottom', 'left'));
                board.push(space('bottom', 'middle'));
                board.push(space('bottom', 'right'));
            },
            getBoard: function() {
                return board;
            },
            getRowByIndex: function(index) {
                let row = board[index].row;

                return board.filter(space => space.row === row);
            },
            getColumnByIndex: function(index) {
                let column = board[index].column;

                return board.filter(space => space.column === column);
            },
            updateSpace: function(index, symbol) {
                if(!board[index].taken) {
                    board[index].taken = true;
                    board[index].move = symbol;
                    console.log(board[index]);
                }
            },
        }
    })();

    // Controls display of board and results
    const Display = (function() {
        const elements = {
            board: '.board',
            spaces: '.space'
        };

        // 1. Board space is clicked
        // 2. Put X or O on the space in DOM
        // 3. Game -> GameBoard -> Set space.move to X or O
        // 4. Game -> GameBoard -> Set space.taken to true
        // 5. Game -> Check for win conditions
        function updateSpace(event) {
            let element = event.target;
            if(!element.textContent) {
                let currentPlayer = Game.getCurrentPlayer();
                element.textContent = currentPlayer.symbol;
                Game.turn(event.target.getAttribute('data-index'));
            }
        }
        
        return {
            render: function() {
                let board = GameBoard.getBoard();
                let boardDOM = document.querySelector(elements.board);
                board.forEach((space, index) => {
                    console.log(space);
                    let element = document.createElement('div');
                    element.classList.add('space');
                    element.classList.add(space.row);
                    element.classList.add(space.column);
                    element.setAttribute('data-index', index);
                    element.addEventListener('click', updateSpace);
                    console.log(element);
                    boardDOM.appendChild(element);
                });
            },
            clear: function() {
                let boardDOM = document.querySelector(elements.board);
                while(boardDOM.firstChild) {
                    boardDOM.removeChild(boardDOM.firstChild);
                }
            }
        };
    })();

    // Player factory function
    let player = function(symbol, id) {

        return {symbol, id}
    };

    // Controls the game, win conditions
    const Game = (function() {
        let players = [];
        let currentPlayer;

        function checkForGameOver(index) {
            // Check for win vertically:
            // Get all spaces in column from GameBoard
            // Check if all spaces in column have same move -> if so, current player wins
            let column = GameBoard.getColumnByIndex(index);
            console.log(column);

            // Check for win horizontally: 
            // Get all spaces in row from GameBoard
            // Check if all spaces in row have same move -> if so, current player wins
            let row = GameBoard.getRowByIndex(index);
            console.log(row);

            // Check for tie
            // If all spaces filled and no one has won, game is a tie.
        }

        return {
            init: function() {
                // initialize and render the gameboard
                GameBoard.initBoard();
                Display.clear();
                Display.render();

                // initialize players
                players[0] = player('X', 0);
                players[1] = player('O', 1);
                currentPlayer = players[0];
                console.log(currentPlayer);
            },
            getCurrentPlayer: function() {
                return currentPlayer
            },
            turn: function(index) {
                // Update GameBoard
                GameBoard.updateSpace(index, currentPlayer.symbol);
                checkForGameOver(index);

                // Switch active player
                if (currentPlayer.id === 0) {
                    currentPlayer = players[1];
                } else {
                    currentPlayer = players[0];
                }
            },
        }
    })();

    Game.init();
})();
