export default class View {
  constructor() {
    this.app = this.getElement("#root");
    this._boardDiv = this.createElement("div", [], ["board"]);
  }

  getElement(selector) {
    return document.querySelector(selector);
  }

  renderBoard(board) {
    board.forEach((column) => {
      const colDiv = this.createElement("div", [], ["column"]);
      for (let gridPlace of column) {
        if (gridPlace === "0") {
          const blankGridPlace = this.createElement("div", [], ["blank-place"]);
          colDiv.append(blankGridPlace);
        } else if (gridPlace === "red") {
          const redGridPlace = this.createElement("div", [], ["red-place"]);
          colDiv.append(redGridPlace);
        } else if (gridPlace === "blue") {
          const blueGridPlace = this.createElement("div", [], ["blue-place"]);
          colDiv.append(blueGridPlace);
        }
      }

      this._boardDiv.append(colDiv);
    });
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
