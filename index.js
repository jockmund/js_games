import Game from "./src/game.js"
import View from "./src/view.js";

const root = document.getElementById('root')

const row = 20
const column = 10

const view = new View(root, 700, 300, row, column)
const game = new Game(row, column)

game.on('keyPress', (data) => {
    view.emit('keyPress', data)
})

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            game.moveToUp()
            break
        case 'ArrowRight':
            game.moveToRight()
            break
        case 'ArrowDown':
            game.moveToDown()
            break
        case 'ArrowLeft':
            game.moveToLeft()
            break
        case 'Enter':
            game.rotatePiece()
            break
        case 'p':
            game.rotate(false)
            break
    }
    game.emit('keyPress', game.playfieldWithPiece)
})

view.render(game.playfieldWithPiece)

window.game = game

