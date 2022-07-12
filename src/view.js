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

        this.panelWidth = this.width * 0.35
        this.gameWidth = this.width * 0.65

        this.canvas = document.createElement('canvas')
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.context = this.canvas.getContext('2d')

        this.blockWidth = this.gameWidth / column
        this.blockHeight = this.height / row

        this.root.appendChild(this.canvas)

        this.on('keydown', this.handleRender.bind(this))
        this.on('clearedLines', this.renderPanel.bind(this))
    }

    renderStart(data) {
        this.clearPlayfield()
        this.renderPlayfield(data)
        this.renderPanel(data)
    }

    handleRender(data) {
        this.clearPlayfield()
        this.renderPlayfield(data)
    }

    renderPlayfield({ playfield }) {
        this.context.strokeStyle = 'white'
        this.context.strokeRect(0, 0, this.gameWidth, this.height)

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
        this.context.clearRect(0, 0, this.gameWidth, this.height)
    }

    renderPanel({ lvl, lines, score, nextPiece }) {
        this.context.fillStyle = 'white'
        this.context.font = '0.7rem "Press Start 2P"'

        const gap = 15
        const posX = this.gameWidth + 3

        this.clearPanel(posX)

        this.context.fillText(`Уровень: ${lvl}`, posX, gap)
        this.context.fillText(`Счет: ${score}`, posX, gap * 2)
        this.context.fillText(`Линии: ${lines}`, posX, gap * 3)
        this.context.fillText(`Следующая фигура:`, posX, gap * 5)

        this.renderNextPiece(nextPiece, gap * 5)
    }

    renderNextPiece(nextPiece, posY) {
        const block = nextPiece.block
        const blockWidth = 20
        const blockHeight = 20
        for (let i = 0; i < block.length; i++) {
            for (let j = 0; j < block[i].length; j++) {
                if (!block[i][j])
                    continue

                const color = View.blockColors[block[i][j]]
                const x = blockWidth * j + this.gameWidth + 10
                const y = blockHeight * i + posY

                this.renderBlock(x, y, blockWidth, blockHeight, color)
            }
        }
    }

    clearPanel(posX) {
        this.context.clearRect(posX, 0, this.panelWidth, this.height)
    }
}