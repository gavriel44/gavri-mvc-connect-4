export default class Controller {
  constructor(modal, view) {
    this.modal = modal;
    this.view = view;

    this.modal.bindBoardChange(this.#onBoardChange);
    this.modal.bindWin(this.onWin);

    this.view.bindDropInColumn(this.#handleDrop);

    // initial render
    this.modal.restartGame();

    this._turn = "red";
  }

  onWin = (color) => {
    this.view.renderWin(color);
    this.modal.restartGame();
  };

  #onBoardChange = (board) => {
    this.view.renderBoard(board);
  };

  #handleDrop = (column) => {
    this.nextTurn();
    this.modal.dropDisc(column, this.turn);
  };
  get turn() {
    return this._turn;
  }
  set turn(color) {
    this._turn = color;
  }
  nextTurn() {
    this.turn =
      this.turn === "red" ? (this.turn = "blue") : (this.turn = "red");
  }
}
