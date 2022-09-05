import { Game } from './lib/game.js'
import { welcomeModal } from './lib/modals.js'

window.game = new Game()
game.run()

document.getElementById('reset').onclick = () => game.reset()

welcomeModal.open()


// we can deffer loading of the social share elements
setTimeout(() => {
  import("./lib/share.js");
}, 0)