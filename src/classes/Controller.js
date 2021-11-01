import Modal from "./Modal";

export default class Controller {
  constructor(modal, view) {
    this.modal = modal;
    this.view = view;

    this.modal.bindBoardChange(this.#onBoardChange);
    this.modal.bindWin(this.onWin);
    this.modal.bindOnTie(this.onTie);

    this.view.bindDropInColumn(this.#handleDrop);

    // initial render
    this.modal.restartGame();
    this.modal.makeAiMove();

    this._turn = "red";
  }

  onTie = () => {
    this.view.renderTie();
    this.modal.restartGame();
  };

  onWin = (color) => {
    setTimeout(() => {
      this.view.renderWin(color);
      this.modal.restartGame();
    }, 100);
    // not

    this.modal.board;
  };

  #onBoardChange = (board) => {
    this.view.renderBoard(board);
  };

  #handleDrop = (column) => {
    this.nextTurn();
    this.modal.dropDisc(column, "blue");
    this.modal.makeAiMove();
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
