export default class Game {
    lines = 0;
    score = 0;
    lvl = 0;
    playfield = [
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    ];
    activePiece = {
        x: 5,
        y: 16,
        block: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]
    };

    constructor() {
        document.addEventListener('keyup', (event) => {
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
            }
            this.showPlayfield()
        })
    }

// todo
    addPiece() {
        const {x, y} = this.activePiece
        const pieceLength = this.activePiece.block.length - 1
    }
// #todo

    showPlayfield() {
        let res = ``
        this.playfield.forEach(y => {
            y.forEach(x => {
                res += `${x} `
            })
            res += `\n`
        })

        console.log(res)
    }

    showPiece() {
        const {x, y} = this.activePiece
        let piece = ``
        for (let i = 0; i < this.activePiece.block.length; i++) {
            if (this.checkInside())
            for (let j = 0; j < this.activePiece.block.length; j++) {
                piece += `${this.playfield[y + i][x + j]} `
            }
            piece += `\n`
        }
        console.log(piece)
    }

    moveToRight() {
        if (this.checkInside(this.activePiece.x + 1, this.activePiece.y))
            this.activePiece.x += 1

        console.log(this.activePiece)
    }

    moveToLeft() {
        if (this.checkInside(this.activePiece.x - 1, this.activePiece.y))
            this.activePiece.x -= 1

        console.log(this.activePiece)
    }

    moveToUp() {
        if (this.checkInside(this.activePiece.x, this.activePiece.y - 1))
            this.activePiece.y -= 1

        console.log(this.activePiece)
    }

    moveToDown() {
        if (this.checkInside(this.activePiece.x, this.activePiece.y + 1))
            this.activePiece.y += 1

        console.log(this.activePiece)
    }

    checkInside(x, y) {
        const pieceLength = this.activePiece.block.length - 1

        return !(this.playfield[y] === undefined) && !(this.playfield[y + pieceLength] === undefined)
            && !(this.playfield[y][x] === undefined) && !(this.playfield[y][x + pieceLength] === undefined)
    }
}