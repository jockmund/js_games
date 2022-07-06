import EventEmitter from "./EventEmitter.js";
import pieces from "./typesPieces.js";

export default class Game extends EventEmitter{
    lines = 0;
    score = 0;
    lvl = 0;

    constructor(row, column) {
        super()
        this.playfield = this.createPlayfield(row, column)
        this.activePiece = this.createNewPiece()
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

    createPlayfield(row, column) {
        const playfield = []

        for (let i = 0; i < row; i++) {
            playfield[i] = []
            for (let j = 0; j <column; j++){
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

        this.changeActivePiece()
    }
    
    changeActivePiece() {
        this.activePiece = this.createNewPiece()
    }

    createNewPiece() {
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
            return
        }
        this.addPiece()
    }

    moveToLeft() {
        if (this.checkInside(this.activePiece.x - 1, this.activePiece.y)) {
            this.activePiece.x -= 1
            return
        }
        this.addPiece()
    }

    moveToUp() {
        if (this.checkInside(this.activePiece.x, this.activePiece.y - 1)) {
            this.activePiece.y -= 1
            return
        }
        this.addPiece()
    }

    moveToDown() {
        if (this.checkInside(this.activePiece.x, this.activePiece.y + 1)) {
            this.activePiece.y += 1
            return
        }
        this.addPiece()
    }

    rotatePiece() {
        this.rotate()

        if (!this.checkInside())
            this.rotate(false)
    }

    rotate(clockwise = true) {
        const { block } = this.activePiece
        const blockLength = block.length

        const rotateYCount = Math.floor(blockLength / 2)
        const rotateXCount = blockLength - 1

        for (let i = 0; i < rotateYCount; i++) {
            for (let j = 0; j < rotateXCount; j++) {
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
}