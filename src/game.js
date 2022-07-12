import EventEmitter from "./EventEmitter.js";
import pieces from "./typesPieces.js";

export default class Game extends EventEmitter {
    static points = {
        1: 40,
        2: 100,
        3: 300,
        4: 1200
    }

    lines = 0;
    score = 0;

    constructor(row, column) {
        super()
        this.playfield = this.createPlayfield(row, column)
        this.keydownHandler = this.handleKeydown.bind(this)
    }

    get playfieldWithPiece() {
        const {x, y, block} = this.activePiece
        const playfield = JSON.parse(JSON.stringify(this.playfield));

        for (let i = 0; i < block.length; i++) {
            for (let j = 0; j < block.length; j++) {
                if (!block[i][j]) continue

                playfield[y + i][x + j] = block[i][j]
            }
        }

        return playfield
    }

    get lvl() {
        const level = Math.floor(this.lines * 0.1)
        return level === 0 ? 1 : level
    }

    getState() {
        return  {
            playfield: this.playfieldWithPiece,
            lvl: this.lvl,
            lines: this.lines,
            score: this.score,
            nextPiece: this.nextPiece,
        }
    }

    start() {
        this.activePiece = this.createPiece()
        this.nextPiece = this.createPiece()
        document.addEventListener('keydown', this.keydownHandler)
        document.getElementById('start').disabled = 'true'
    }

    end() {
        this.activePiece = {}
        this.nextPiece = {}
        document.removeEventListener('keydown', this.keydownHandler)
        document.getElementById('qwe').textContent = "Игра окончена"
    }

    handleKeydown(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.moveToUp()
                break
            case 'ArrowRight':
                this.moveToRight()
                break
            case 'ArrowDown':
                this.moveToDown()
                break
            case 'ArrowLeft':
                this.moveToLeft()
                break
            case 'Enter':
                this.rotatePiece()
                break
        }
        this.emit('keydown', this.getState())

        if (!this.checkInside(this.activePiece.x, this.activePiece.y)) {
            this.emit('endGame')
        }
    }

    createPlayfield(row, column) {
        const playfield = []

        for (let i = 0; i < row; i++) {
            playfield[i] = []
            for (let j = 0; j < column; j++) {
                playfield[i][j] = 0
            }
        }
        return playfield
    }

    addPiece() {
        const {x, y} = this.activePiece
        const pieceBlock = this.activePiece.block
        const pieceLength = pieceBlock.length

        for (let i = 0; i < pieceLength; i++) {
            for (let j = 0; j < pieceLength; j++) {
                if (!pieceBlock[i][j]) continue
                this.playfield[y + i][x + j] = pieceBlock[i][j]
            }
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece
        this.nextPiece = this.createPiece()
    }

    createPiece() {
        const block = pieces[Math.floor(Math.random() * pieces.length)]

        const posX = Math.floor(Math.random() * (this.playfield[0].length - (block.length - 1)))

        const x = posX < 0 ? 0 : posX
        const y = 0

        return {
            x,
            y,
            block
        }
    }

    showPlayfield(playfield) {
        let res = ``
        playfield.forEach(y => {
            y.forEach(x => {
                res += `${x} `
            })
            res += `\n`
        })

        console.log(res)
    }

    moveToRight() {
        if (this.checkInside(this.activePiece.x + 1, this.activePiece.y)) {
            this.activePiece.x += 1
        }
    }

    moveToLeft() {
        if (this.checkInside(this.activePiece.x - 1, this.activePiece.y)) {
            this.activePiece.x -= 1
        }
    }

    moveToUp() {
        if (this.checkInside(this.activePiece.x, this.activePiece.y - 1)) {
            this.activePiece.y -= 1
        }
    }

    moveToDown() {
        if (this.checkInside(this.activePiece.x, this.activePiece.y + 1)) {
            this.activePiece.y += 1
            return
        }

        this.updateState()

        this.emit('clearedLines', this.getState())
    }

    updateState() {
        this.addPiece()
        this.updatePieces()

        const clearedLines = this.clearLines()
        this.updateScore(clearedLines)
    }

    rotatePiece() {
        this.rotate()

        if (!this.checkInside())
            this.rotate(false)
    }

    rotate(clockwise = true) {
        const {block} = this.activePiece
        const blockLength = block.length

        const rotateYCount = Math.floor(blockLength / 2)
        const rotateXCount = blockLength - 1

        for (let i = 0; i < rotateYCount; i++) {
            for (let j = i; j < rotateXCount - i; j++) {
                const tmp = block[i][j]

                if (clockwise) {
                    block[i][j] = block[rotateXCount - j][i]
                    block[rotateXCount - j][i] = block[rotateXCount - i][rotateXCount - j]
                    block[rotateXCount - i][rotateXCount - j] = block[j][rotateXCount - i]
                    block[j][rotateXCount - i] = tmp
                } else {
                    block[i][j] = block[j][rotateXCount - i]
                    block[j][rotateXCount - i] = block[rotateXCount - i][rotateXCount - j]
                    block[rotateXCount - i][rotateXCount - j] = block[rotateXCount - j][i]
                    block[rotateXCount - j][i] = tmp
                }
            }
        }
    }

    checkInside(x = this.activePiece.x, y = this.activePiece.y) {
        const block = this.activePiece.block
        const pieceLength = block.length
        const playfield = this.playfield

        for (let i = 0; i < pieceLength; i++) {
            for (let j = 0; j < pieceLength; j++) {
                if (block[i][j] && (playfield[y + i] === undefined || playfield[y + i][x + j] === undefined || playfield[y + i][x + j])) {
                    return false
                }
            }
        }

        return true
    }

    clearLines() {
        const playfield = JSON.parse(JSON.stringify(this.playfield));
        const linesForClear = this.findFullLines()

        linesForClear.forEach(line => {
            playfield.splice(line, 1)
        })

        if (linesForClear.length)
            this.addClearedLines(linesForClear.length, playfield)

        return linesForClear.length
    }

    addClearedLines(count, playfield) {
        const pieceOfPlayfield = this.createPlayfield(count, playfield[0].length)

        this.playfield = pieceOfPlayfield.concat(playfield)
    }

    findFullLines() {
        const playfield = this.playfield
        const linesForClear = []

        for (let i = playfield.length - 1; i >= 0; i--) {
            const line = playfield[i]

            const lineValues = line.filter(el => el !== 0)

            if (lineValues.length === line.length)
                linesForClear.push(i)
        }

        return linesForClear
    }

    updateScore(countClearedLines) {
        if (countClearedLines <= 0)
            return

        this.score += Game.points[countClearedLines] * this.lvl
        this.lines += countClearedLines
    }
}