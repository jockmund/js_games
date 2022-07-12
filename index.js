import Controller from "./src/controller.js";

const root = document.getElementById('root')
const row = 20
const column = 10
const height = 640
const width = 520

const game = new Controller(root, row, column, height, width)

document.getElementById('start').addEventListener('click', () => {
    game.start()
})

window.game = game