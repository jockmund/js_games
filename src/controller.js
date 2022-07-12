import EventEmitter from "./EventEmitter.js";
import View from "./view.js";
import Game from "./game.js";

export default class Controller extends EventEmitter {
    constructor(root, row, column, height, width) {
        super();

        this.view = new View(root, height, width, row, column)
        this.game = new Game(row, column)

        this.game.on('keydown', this.handleKeydown.bind(this))
        this.game.on('endGame', this.end.bind(this))
        this.game.on('clearedLines', this.handleClearedLines.bind(this))

    }

    handleClearedLines(data) {
        this.view.emit('clearedLines', data)
    }

    handleKeydown(data) {
        this.view.emit('keydown', data)
    }

    start() {
        this.game.start()
        console.log(this.game.getState())
        this.view.renderStart(this.game.getState())
    }

    end() {
        this.game.end()
    }
}