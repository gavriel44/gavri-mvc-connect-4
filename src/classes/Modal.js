export default class Modal {
  #boardWidth = 7;
  #boardHeight = 6;
  constructor() {
    this.board =
      localStorage.getItem("board") ||
      Array(this.#boardWidth).fill(Array(this.#boardHeight).fill("0"));
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

  dropDisc(colNum, color) {
    let flag = false;

    const boardCol = this.board[colNum];
    for (let i = 0; i < this.boardHeight; i++) {
      const gridPlace = boardCol[i];
      if (gridPlace === "0") {
        boardCol[i] = color;
        flag = true;
      }
    }
    if (flag) {
      this.#_commit(this.board);
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
          this.board[j][i] === color &&
          this.board[j][i + 1] == color &&
          this.board[j][i + 2] == color &&
          this.board[j][i + 3] == color
        ) {
          return true;
        }
      }
    }
    // verticalCheck
    for (let i = 0; i < this.boardWidth - 3; i++) {
      for (let j = 0; j < this.boardHeight; j++) {
        if (
          this.board[i][j] == color &&
          this.board[i + 1][j] == color &&
          this.board[i + 2][j] == color &&
          this.board[i + 3][j] == color
        ) {
          return true;
        }
      }
    }
    // ascendingDiagonalCheck
    for (let i = 3; i < this.boardWidth; i++) {
      for (let j = 0; j < this.boardHeight - 3; j++) {
        if (
          this.board[i][j] == color &&
          this.board[i - 1][j + 1] == color &&
          this.board[i - 2][j + 2] == color &&
          this.board[i - 3][j + 3] == color
        )
          return true;
      }
    }
    // descendingDiagonalCheck
    for (let i = 3; i < this.boardWidth; i++) {
      for (let j = 3; j < this.boardHeight; j++) {
        if (
          this.board[i][j] == color &&
          this.board[i - 1][j - 1] == color &&
          this.board[i - 2][j - 2] == color &&
          this.board[i - 3][j - 3] == color
        )
          return true;
      }
    }
    return false;
  }

  get boardHeight() {
    return this.board[0].length;
  }
  get boardWidth() {
    return this.board.length;
  }
}
