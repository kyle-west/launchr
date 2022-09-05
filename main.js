import { Game } from './lib/game.js'
import { welcomeModal } from './lib/modals.js'

window.game = new Game()
game.run()

document.getElementById('reset').onclick = ({ target }) => {
  game.reset()
}

welcomeModal.open()
