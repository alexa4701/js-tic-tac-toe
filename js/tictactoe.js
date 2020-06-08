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
            reset: function() {
                board.forEach(space => {
                    space.move = '';
                    space.taken = false;
                });
            },
            getBoard: function() {
                return board;
            },
            getSpace: function(index) {
                return board[index];
            },
            getRowByIndex: function(index) {
                let row = board[index].row;

                return board.filter(space => space.row === row);
            },
            getColumnByIndex: function(index) {
                let column = board[index].column;

                return board.filter(space => space.column === column);
            },
            getDiagonalCenter: function(num) {
                let diagonal = [];

                diagonal.push(board[4]);
                if (num === 1) {
                    diagonal.push(0);
                    diagonal.push(8);
                } else if (num === 2) {
                    diagonal.push(2);
                    diagonal.push(6);
                }

                return diagonal;
            },
            getDiagonalByIndex: function(index) {
                let column = board[index].column;
                let row = board[index].row;
                let diagonal = [];

                diagonal.push(board[index]);
                switch (row) {
                    case 'top':
                        if(column === 'left') {
                            diagonal.push(board[4]);
                            diagonal.push(board[8]);
                        } else if (column === 'right') {
                            diagonal.push(board[4]);
                            diagonal.push(board[6]);
                        }
                        break;
                    case 'bottom':
                        if(column === 'left') {
                            diagonal.push(board[4]);
                            diagonal.push(board[2]);
                        } else if (column === 'right') {
                            diagonal.push(board[4]);
                            diagonal.push(board[0]);
                        }
                        break;
                }

                return diagonal;
            },
            updateSpace: function(index, symbol) {
                if(!board[index].taken) {
                    board[index].taken = true;
                    board[index].move = symbol;
                }
            },
        }
    })();

    // Controls display of board and results
    const Display = (function() {
        const elements = {
            board: '.board',
            spaces: '.space',
            title: '.title h4',
            resetButton: '.reset',
            playerOneScore: '.player1 .score',
            playerTwoScore: '.player2 .score',
        };

        function updateSpace(event) {
            if(!Game.getGameOverFlag()) {
                let element = event.target;
                if(!element.textContent) {
                    let currentPlayer = Game.getCurrentPlayer();
                    element.textContent = currentPlayer.symbol;
                    Game.turn(event.target.getAttribute('data-index'));
                }
            }
        }

        function resetBoard() {
            Game.reset();
        }
        
        return {
            render: function() {
                let board = GameBoard.getBoard();
                let boardDOM = document.querySelector(elements.board);
                let resetButtonDOM = document.querySelector(elements.resetButton);

                resetButtonDOM.addEventListener('click', resetBoard);
                board.forEach((space, index) => {
                    let element = document.createElement('div');
                    element.classList.add('space');
                    element.classList.add(space.row);
                    element.classList.add(space.column);
                    element.setAttribute('data-index', index);
                    element.addEventListener('click', updateSpace);
                    boardDOM.appendChild(element);
                });
            },
            clear: function() {
                let boardDOM = document.querySelector(elements.board);
                while(boardDOM.firstChild) {
                    boardDOM.removeChild(boardDOM.firstChild);
                }
            },
            updateScores: function(score1, score2) {
                let player1ScoreDOM = document.querySelector(elements.playerOneScore);
                let player2ScoreDOM = document.querySelector(elements.playerTwoScore);

                player1ScoreDOM.textContent = score1;
                player2ScoreDOM.textContent = score2;
            },
            showWinner: function(player) {
                let titleDOM = document.querySelector(elements.title);

                titleDOM.textContent = `${player.symbol} wins!`;
            },
            resetTitle: function() {
                let titleDOM = document.querySelector(elements.title);

                titleDOM.textContent = `Tic Tac Toe!`;
            },
            showTie: function() {
                let titleDOM = document.querySelector(elements.title);

                titleDOM.textContent = `It's a tie!`;
            }
        };
    })();


    // Controls the game, win conditions
    const Game = (function() {
        // Player factory function
        let player = function(symbol, id) {
            let score = 0;
            return {symbol, id, score}
        };

        let players = [];
        let currentPlayer;
        let winner;
        let gameOverFlag = false;
        let turnNumber = 1;

        function checkForGameOver(index, currentSymbol) {
            let column = GameBoard.getColumnByIndex(index);
            let row = GameBoard.getRowByIndex(index);
            let diagonal1, diagonal2;

            // Check column for win
            if(column.every(space => space.move === currentSymbol)) {
                winner = currentPlayer;
                return true;
            }

            // Check row for win
            if(row.every(space => space.move === currentSymbol)) {
                winner = currentPlayer;
                return true;
            }

            // Check diagonal for win, if corner or middle space
            if(index % 2 === 0) {
                if(GameBoard.getSpace(index).row === 'center' && GameBoard.getSpace(index).column === 'middle') {
                    diagonal1 = GameBoard.getDiagonalCenter(1);
                    diagonal2 = GameBoard.getDiagonalCenter(2);
    
                    if(diagonal1.every(space => space.move === currentSymbol)) {
                        winner = currentPlayer;
                        return true;
                    } else if(diagonal2.every(space => space.move === currentSymbol)) {
                        winner = currentPlayer;
                        return true;
                    }
    
                } else {
                    diagonal1 = GameBoard.getDiagonalByIndex(index);
    
                    if(diagonal1.every(space => space.move === currentSymbol)) {
                        winner = currentPlayer;
                        return true;
                    }
                }
            }

            // Check for tie
            if(turnNumber >= 9) {
                return true;
            }

            return false;
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
            },
            reset: function() {
                gameOverFlag = false;
                turnNumber = 1;
                winner = {};
                currentPlayer = players[0];
                GameBoard.reset();
                Display.clear();
                Display.render();
                Display.resetTitle();
            },
            getCurrentPlayer: function() {
                return currentPlayer;
            },
            getGameOverFlag: function() {
                return gameOverFlag;
            },
            turn: function(index) {
                // Update GameBoard
                GameBoard.updateSpace(index, currentPlayer.symbol);
                gameOverFlag = checkForGameOver(index, currentPlayer.symbol);

                if(gameOverFlag) {
                    if(winner) {
                        winner.score++;
                        Display.updateScores(players[0].score, players[1].score);
                        Display.showWinner(winner);
                    }
                    else {
                        Display.showTie();
                    }
                } else {
                    turnNumber++;
                    // Switch active player
                    if (currentPlayer.id === 0) {
                        currentPlayer = players[1];
                    } else {
                        currentPlayer = players[0];
                    }
                }
            },
        }
    })();

    Game.init();
})();
