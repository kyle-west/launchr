import { Game } from './lib/game.js'

const game = new Game()
game.run()

document.getElementById('reset').onclick = ({ target }) => {
  game.reset()
  target.blur()
}