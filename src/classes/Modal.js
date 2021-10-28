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
  }

  startGame() {
    this.#_commit(this._board);
  }

  dropDisc(colNum, color) {
    let flag = false;

    const boardCol = this._board[colNum];
    for (let i = 0; i < this.boardHeight; i++) {
      const gridPlace = boardCol[i];
      if (gridPlace === "0") {
        boardCol[i] = color;
        flag = true;
        break;
      }
    }
    if (flag) {
      this.#_commit(this._board);
    } else {
      throw new Error("illegal move: column full");
    }
  }

  checkIfWin() {
    if (this.checkIfColorWin("red")) {
      this.onWin("red");
    } else if (this.checkIfColorWin("blue")) {
      this.onWin("blue");
    }
  }

  checkIfColorWin(color) {
    for (let i = 0; i < this.boardHeight - 3; i++) {
      for (let j = 0; j < this.boardWidth; j++) {
        if (
          this._board[j][i] === color &&
          this._board[j][i + 1] === color &&
          this._board[j][i + 2] === color &&
          this._board[j][i + 3] === color
        ) {
          return true;
        }
      }
    }
    // verticalCheck
    for (let i = 0; i < this.boardWidth - 3; i++) {
      for (let j = 0; j < this.boardHeight; j++) {
        if (
          this._board[i][j] === color &&
          this._board[i + 1][j] === color &&
          this._board[i + 2][j] === color &&
          this._board[i + 3][j] === color
        ) {
          return true;
        }
      }
    }
    // ascendingDiagonalCheck
    for (let i = 3; i < this.boardWidth; i++) {
      for (let j = 0; j < this.boardHeight - 3; j++) {
        if (
          this._board[i][j] === color &&
          this._board[i - 1][j + 1] === color &&
          this._board[i - 2][j + 2] === color &&
          this._board[i - 3][j + 3] === color
        )
          return true;
      }
    }
    // descendingDiagonalCheck
    for (let i = 3; i < this.boardWidth; i++) {
      for (let j = 3; j < this.boardHeight; j++) {
        if (
          this._board[i][j] === color &&
          this._board[i - 1][j - 1] === color &&
          this._board[i - 2][j - 2] === color &&
          this._board[i - 3][j - 3] === color
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
}
