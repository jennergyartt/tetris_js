        const WIDTH = 10;
        const HEIGHT = 20;
        const GAME_SPEED = 500;

        const TETROMINOES = [
            [[1, 1, 1, 1]],
            [[1, 1], [1, 1]],
            [[1, 1, 1], [0, 1, 0]],
            [[1, 1, 1], [1, 0, 0]],
            [[1, 1, 1], [0, 0, 1]],
            [[1, 1, 1], [0, 1, 0]],
            [[1, 1, 1], [1, 0, 0]]
        ];

        const COLORS = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white'];

        let gameBoard = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null));
        let currentTetromino = null;
        let currentRow = 0;
        let currentCol = 0;
        let currentTetrominoIndex = 0;
        let currentColor = null;
        let gameInterval = null;

        function getRandomTetromino() {
            console.log("getRandomTetromino")
            const index = Math.floor(Math.random() * TETROMINOES.length);
            return TETROMINOES[index];
        }

        function drawGameBoard() {
            console.log("drawGameBoard")
            const gameBoardElement = document.getElementById('game-board');
            gameBoardElement.innerHTML = '';

            for (let row = 0; row < HEIGHT; row++) {
                for (let col = 0; col < WIDTH; col++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    if (gameBoard[row][col]) {
                        cell.style.backgroundColor = gameBoard[row][col];
                    }
                    gameBoardElement.appendChild(cell);
                }
            }
        }

        function canMoveDown() {
            console.log("canMoveDown")
            for (let row = 0; row < currentTetromino.length; row++) {
                for (let col = 0; col < currentTetromino[row].length; col++) {
                    if (currentTetromino[row][col] && (row + currentRow + 1 >= HEIGHT || gameBoard[row + currentRow + 1][col + currentCol])) {
                        return false;
                    }
                }
            }
            return true;
        }

        function moveDown() {
            console.log("moveDown")
            if (canMoveDown()) {
                currentRow++;
            } else {
                placeTetromino();
            }
        }

        function placeTetromino() {
            console.log("placeTetromino")
            for (let row = 0; row < currentTetromino.length; row++) {
                for (let col = 0; col < currentTetromino[row].length; col++) {
                    if (currentTetromino[row][col]) {
                        gameBoard[row + currentRow][col + currentCol] = currentColor;
                    }
                }
            }
            checkRows();
            currentTetromino = getRandomTetromino();
            currentRow = 0;
            currentCol = Math.floor(WIDTH / 2) - Math.floor(currentTetromino[0].length / 2);
            currentColor = COLORS[currentTetrominoIndex];
            currentTetrominoIndex = (currentTetrominoIndex + 1) % TETROMINOES.length;
            if (!canMoveDown()) {
                clearInterval(gameInterval);
                alert('Game Over!');
            }
        }

        function checkRows() {
            console.log("checkRows")
            for (let row = HEIGHT - 1; row >= 0; row--) {
                if (gameBoard[row].every(cell => cell !== null)) {
                    gameBoard.splice(row, 1);
                    gameBoard.unshift(Array(WIDTH).fill(null));
                }
            }
        }

        function drawTetromino() {
            console.log("drawTetromino")
            for (let row = 0; row < currentTetromino.length; row++) {
                for (let col = 0; col < currentTetromino[row].length; col++) {
                    if (currentTetromino[row][col]) {
                        const x = col + currentCol;
                        const y = row + currentRow;
                        if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
                            gameBoard[y][x] = currentColor;
                        }
                    }
                }
            }
        }

        function handleKeyPress(event) {
            console.log("handleKeyPress")
            switch (event.key) {
                case 'ArrowLeft':
                    if (currentCol > 0) {
                        currentCol--;
                    }
                    break;
                case 'ArrowRight':
                    if (currentCol + currentTetromino[0].length < WIDTH) {
                        currentCol++;
                    }
                    break;
                case 'ArrowDown':
                    moveDown();
                    break;
                case 'ArrowUp':
                    rotateTetromino();
                    break;
            }
        }

        function rotateTetromino() {
            console.log("rotateTetromino")
            const newTetromino = [];
            for (let col = 0; col < currentTetromino[0].length; col++) {
                const newRow = [];
                for (let row = currentTetromino.length - 1; row >= 0; row--) {
                    newRow.push(currentTetromino[row][col]);
                }
                newTetromino.push(newRow);
            }
            if (canRotate(newTetromino)) {
                currentTetromino = newTetromino;
            }
        }

        function canRotate(newTetromino) {
            for (let row = 0; row < newTetromino.length; row++) {
                for (let col = 0; col < newTetromino[row].length; col++) {
                    if (
                        newTetromino[row][col] &&
                        (currentCol + col < 0 || currentCol + col >= WIDTH || currentRow + row >= HEIGHT || gameBoard[currentRow + row][currentCol + col])
                    ) {
                        return false;
                    }
                }
            }
            return true;
        }

        function startGame() {
            gameBoard = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null));
            currentTetromino = getRandomTetromino();
            currentRow = 0;
            currentCol = Math.floor(WIDTH / 2) - Math.floor(currentTetromino[0].length / 2);
            currentColor = COLORS[currentTetrominoIndex];
            currentTetrominoIndex = (currentTetrominoIndex + 1) % TETROMINOES.length;

            if (gameInterval) {
                clearInterval(gameInterval);
            }

            gameInterval = setInterval(() => {
                moveDown();
                drawGameBoard();
                drawTetromino();
            }, GAME_SPEED);

            window.addEventListener('keydown', handleKeyPress);
        }

        startGame();
