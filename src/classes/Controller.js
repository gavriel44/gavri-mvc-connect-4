export default class Controller {
  constructor(modal, view) {
    this.modal = modal;
    this.view = view;

    this.modal.bindBoardChange(this.onBoardChange);
    this.modal.bindWin(this.onWin);

    // initial render
    this.onBoardChange(this.modal.board);
  }

  onWin(color) {
    this.view.renderWin(color);
  }

  onBoardChange(board) {
    this.view.renderBoard(board);
  }
}
