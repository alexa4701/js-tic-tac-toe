'use strict';

(function() {
    // Player object
    const Player = function() {};

    // Controls the game board and spaces
    const GameBoard = (function() {
        // Board space factory function
        const space = function(vertical, horizontal) {
            let move = '';
            let taken = false;
            return {vertical, horizontal, move, taken};
        }

        let board = [];



        // console.log(board);

        return {
            getBoard: function() {
                return board;
            },
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
        }
    })();

    // Controls display of board and results
    const Display = (function() {
        const elements = {
            board: '.board',
            spaces: '.spaces'
        };
        
        return {
            render: function() {
                let board = GameBoard.getBoard();
                let boardDOM = document.querySelector(elements.board);
                board.forEach((space, index) => {
                    console.log(space);
                    let element = document.createElement('div');
                    element.classList.add('space');
                    element.classList.add(space.vertical);
                    element.classList.add(space.horizontal);
                    element.setAttribute('data-index', index);
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

    // Controls the game, win conditions
    const Game = (function() {

        return {
            init: function() {
                GameBoard.initBoard();
                Display.clear();
                Display.render();
            }
        }
    })();

    Game.init();
})();
