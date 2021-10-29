export default class View {
  constructor() {
    this.app = this.getElement("#root");
    this._boardDiv = this.createElement("div", [], ["board"]);
    this.app.append(this._boardDiv);
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  bindDropInColumn(dropHandler) {
    this._boardDiv.addEventListener("click", (event) => {
      if (Array.from(event.target.classList).includes("grid-place")) {
        const columnNum = event.target.closest(".column").id;
        dropHandler(columnNum);
      }
    });
  }

  renderBoard(board) {
    this.removeAllChildNodes(this._boardDiv);
    board.forEach((column, index) => {
      const colDiv = this.createElement("div", [], ["column"], { id: index });
      for (let gridPlace of column) {
        if (gridPlace === "0") {
          const blankGridPlace = this.createElement(
            "div",
            [],
            ["blank-place", "grid-place"]
          );
          colDiv.append(blankGridPlace);
        } else if (gridPlace === "red") {
          const redGridPlace = this.createElement(
            "div",
            [],
            ["red-place", "grid-place"]
          );
          colDiv.append(redGridPlace);
        } else if (gridPlace === "blue") {
          const blueGridPlace = this.createElement(
            "div",
            [],
            ["blue-place", "grid-place"]
          );
          colDiv.append(blueGridPlace);
        }
      }

      this._boardDiv.append(colDiv);
    });
  }

  renderWin(color) {
    alert(`${color} wins!`);
  }

  renderTie() {
    alert("Tie!");
  }

  removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  createElement(tagName, children = [], classes = [], attributes = {}) {
    const mainElement = document.createElement(tagName);
    children.forEach((childElement) => mainElement.append(childElement));
    mainElement.classList.add(...classes);
    for (let attribute in attributes) {
      mainElement.setAttribute(attribute, attributes[attribute]);
    }
    return mainElement;
  }
}
