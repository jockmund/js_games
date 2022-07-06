import EventEmitter from "./EventEmitter.js";

export default class View extends EventEmitter {
    static blockColors = {
        1: 'rgb(150,100,70)',
        2: 'rgb(150,0,70)',
        3: 'rgb(200,100,150)',
        4: 'rgb(150,220,140)',
        5: 'rgb(70,10,200)',
        6: 'rgb(15,100,70)',
        7: 'rgb(250,100,70)'
    }

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
                    const color = View.blockColors[playfield[i][j]]

                    this.renderBlock(x, y, this.blockWidth, this.blockHeight, color)
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