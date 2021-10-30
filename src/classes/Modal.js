export default class Modal {
  #boardWidth = 7;
  #boardHeight = 6;
  constructor() {
    this._board = this.createBoard();
    // JSON.parse(localStorage.getItem("board")) ||
  }

  bindBoardChange(callback) {
    this.onBoardChange = callback;
  }

  bindWin(callback) {
    this.onWin = callback;
  }

  #_commit(board) {
    this.onBoardChange(board);
    localStorage.setItem("board", JSON.stringify(board));
    this.checkIfWin();
    this.checkIfTie();
  }

  startGame() {
    this.#_commit(this._board);
  }

  checkIfTie() {
    for (let col of this._board) {
      for (let cell of col) {
        if (cell === "0") {
          return;
        }
      }
    }
    this.onTie();
  }

  bindOnTie(callback) {
    this.onTie = callback;
  }

  dropDisc(colNum, color) {
    if (this.dropDiscInboard(colNum, color, this._board)) {
      this.#_commit(this._board);
    } else {
      throw new Error("illegal move: column full");
    }
  }

  dropDiscInboard(colNum, color, board) {
    const boardCol = board[colNum];
    for (let i = 0; i < this.boardHeight; i++) {
      const gridPlace = boardCol[i];
      if (gridPlace === "0") {
        boardCol[i] = color;
        return board;
      }
    }
    return false;
  }

  checkIfWin() {
    if (this.checkIfColorWin("red", this._board)) {
      this.onWin("red");
    } else if (this.checkIfColorWin("blue", this._board)) {
      this.onWin("blue");
    }
  }

  checkIfColorWin(color, board) {
    for (let j = 0; j < this.boardHeight - 3; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        if (
          board[i][j] === color &&
          board[i][j + 1] === color &&
          board[i][j + 2] === color &&
          board[i][j + 3] === color
        ) {
          return true;
        }
      }
    }
    // verticalCheck
    for (let i = 0; i < this.boardWidth - 3; i++) {
      for (let j = 0; j < this.boardHeight; j++) {
        if (
          board[i][j] === color &&
          board[i + 1][j] === color &&
          board[i + 2][j] === color &&
          board[i + 3][j] === color
        ) {
          return true;
        }
      }
    }
    // ascendingDiagonalCheck
    for (let i = 3; i < this.boardWidth; i++) {
      for (let j = 0; j < this.boardHeight - 3; j++) {
        if (
          board[i][j] === color &&
          board[i - 1][j + 1] === color &&
          board[i - 2][j + 2] === color &&
          board[i - 3][j + 3] === color
        )
          return true;
      }
    }
    // descendingDiagonalCheck
    for (let i = 3; i < this.boardWidth; i++) {
      for (let j = 3; j < this.boardHeight; j++) {
        if (
          board[i][j] === color &&
          board[i - 1][j - 1] === color &&
          board[i - 2][j - 2] === color &&
          board[i - 3][j - 3] === color
        )
          return true;
      }
    }
    return false;
  }

  get boardHeight() {
    return this._board[0].length;
  }
  get boardWidth() {
    return this._board.length;
  }

  createBoard() {
    let matrix = [];
    for (var i = 0; i < this.#boardWidth; i++) {
      matrix[i] = [];
      for (var j = 0; j < this.#boardHeight; j++) {
        matrix[i][j] = "0";
      }
    }
    return matrix;
  }

  restartGame() {
    this._board = this.createBoard();
    this.#_commit(this._board);
  }

  makeAiMove() {
    let [col, value] = this.minimax(this._board, 5, -Infinity, Infinity, true);
    this.dropDiscInboard(col, "red", this._board);
    this.checkIfWin();
    this.#_commit(this._board);
  }

  minimax(board, depth, alpha, beta, maximizingPlayer) {
    const validLocations = this.getValidLocations(board);
    const isTerminal = this.isTerminalNode(board);
    if (depth === 0 || isTerminal) {
      if (isTerminal) {
        if (this.checkIfColorWin("red", board)) {
          return [null, Infinity];
        } else if (this.checkIfColorWin("blue", board)) {
          return [null, -Infinity];
        } else {
          return [null, 0];
        }
      } else {
        return [null, this.heuristicFunction(board)];
      }
    }
    if (maximizingPlayer) {
      let value = -Infinity;
      let column = validLocations[0];
      for (let col of validLocations) {
        const bCopy = board.map((arr) => arr.slice());
        this.dropDiscInboard(col, "red", bCopy);
        let newScore = this.minimax(bCopy, depth - 1, alpha, beta, false);
        if (newScore > value) {
          value = newScore;
          column = col;
        }
        alpha = Math.max(alpha, value);
        if (alpha >= beta) {
          break;
        }
      }
      return [column, value];
    } else {
      let value = Infinity;
      let column = validLocations[0];
      for (let col of validLocations) {
        const bCopy = board.map((arr) => arr.slice());
        this.dropDiscInboard(col, "blue", bCopy);
        let newScore = this.minimax(bCopy, depth - 1, alpha, beta, true);
        if (newScore < value) {
          value = newScore;
          column = col;
        }
        beta = Math.min(beta, value);
        if (alpha >= beta) {
          break;
        }
      }
      return [column, value];
    }
  }

  isTerminalNode(board) {
    return (
      this.checkIfColorWin("red", board) ||
      this.checkIfColorWin("blue", board) ||
      this.getValidLocations(board).length === 0
    );
  }

  getValidLocations(board) {
    const validLocations = [];

    for (let col = 0; col < this.boardWidth; col++) {
      if (this.isValidLocation(board, col)) {
        validLocations.push(col);
      }
    }
    return validLocations;
  }

  isValidLocation(board, col) {
    if (board[col].some((cell) => cell === "0")) {
      return true;
    }
    return false;
  }

  heuristicFunction(board) {
    // returns a value for advantage of red

    return (
      this.getNumOfGood3("red", board) * 3 -
      this.getNumOfGood3("blue", board) * 3
    );
  }

  getNumOfGood3(color, board) {
    // check for 3 side by side and have at least one end open
    // blank on top
    let counter = 0;
    for (let j = 0; j < this.boardHeight - 3; j++) {
      for (let i = 0; i < this.boardWidth; i++) {
        if (
          board[i][j] === color &&
          board[i][j + 1] === color &&
          board[i][j + 2] === color &&
          board[i][j + 3] === "0"
        ) {
          counter++;
        }
      }
    }
    // blank on bottom

    // -------------------
    // verticalCheck
    // black on left
    for (let i = 0; i < this.boardWidth - 3; i++) {
      for (let j = 0; j < this.boardHeight; j++) {
        if (
          board[i][j] === "0" &&
          board[i + 1][j] === color &&
          board[i + 2][j] === color &&
          board[i + 3][j] === color
        ) {
          counter++;
        }
        if (
          board[i][j] === color &&
          board[i + 1][j] === color &&
          board[i + 2][j] === color &&
          board[i + 3][j] === "0"
        ) {
          counter++;
        }
      }
    }
    // blank on right

    // ---------------
    // ascendingDiagonalCheck
    for (let i = 3; i < this.boardWidth; i++) {
      for (let j = 0; j < this.boardHeight - 3; j++) {
        if (j > 0) {
          if (
            board[i][j] === "0" &&
            board[i][j - 1] != "0" &&
            board[i - 1][j + 1] === color &&
            board[i - 2][j + 2] === color &&
            board[i - 3][j + 3] === color
          ) {
            counter++;
          }
        } else {
          if (
            board[i][j] === "0" &&
            board[i - 1][j + 1] === color &&
            board[i - 2][j + 2] === color &&
            board[i - 3][j + 3] === color
          ) {
            counter++;
          }
        }

        if (
          board[i][j] === color &&
          board[i - 1][j + 1] === color &&
          board[i - 2][j + 2] === color &&
          board[i - 3][j + 3] === "0" &&
          board[i - 3][j + 2] != "0"
        ) {
          counter++;
        }

        // descendingDiagonalCheck
        for (let i = 3; i < this.boardWidth; i++) {
          for (let j = 3; j < this.boardHeight; j++) {
            if (
              board[i][j] === "0" &&
              board[i][j - 1] !== "0" &&
              board[i - 1][j - 1] === color &&
              board[i - 2][j - 2] === color &&
              board[i - 3][j - 3] === color
            ) {
              counter++;
            }
            if (
              board[i][j] === color &&
              board[i - 1][j - 1] === color &&
              board[i - 2][j - 2] === color &&
              board[i - 3][j - 3] === "0"
            ) {
              counter++;
            }
          }
        }
        return counter;
      }

      // getNumOfGood2() {}
    }
  }
}
