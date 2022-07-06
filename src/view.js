import EventEmitter from "./EventEmitter.js";

export default class View extends EventEmitter {
    constructor(root, height, width, row, column) {
        super()
        this.root = root
        this.height = height
        this.width = width
        this.row = row
        this.column = column

        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext('2d')

        this.blockWidth = width / column
        this.blockHeight = height / row

        this.root.appendChild(this.canvas)

        this.on('keyPress', this.render.bind(this))
    }

    render(playfield) {
        this.clearPlayfield()
        this.renderPlayfield(playfield)
    }

    renderPlayfield(playfield) {
        for (let i = 0; i < playfield.length; i++) {
            for (let j = 0; j < playfield[i].length; j++) {
                if (playfield[i][j]) {
                    const x = this.blockWidth * j
                    const y = this.blockHeight * i

                    this.renderBlock(x, y, this.blockWidth, this.blockHeight, 'rgb(150,100,70)')
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color
        this.context.strokeStyle = 'rgb(150,200,70)'
        this.context.lineWidth = 2
        this.context.fillRect(x, y, width, height)
        this.context.strokeRect(x, y, width, height)
    }

    clearPlayfield() {
        this.context.clearRect(0, 0, this.width, this.height)
    }
}