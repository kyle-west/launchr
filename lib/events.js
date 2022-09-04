import { Modal } from './modals.js';
import { make, p, br, b, ul, li } from './dom.js'

const makeEventType = (eventName) => {
  return class extends CustomEvent {
    static name = eventName;
    constructor(detail = {}) {
      super(eventName, { detail })
      Object.assign(this, detail)
    }
  }
}

export const LandingEvent = makeEventType('rocket-landed')
export const LaunchEvent = makeEventType('rocket-launched')
export const ResetEvent = makeEventType('game-reset')

document.addEventListener(LaunchEvent.name, ({ attempts }) => document.getElementById('write-attempts').innerHTML = attempts)
document.addEventListener(ResetEvent.name, () => document.getElementById('write-attempts').innerHTML = 0)



document.addEventListener(LandingEvent.name, ({ attempts, cost = '2.5B' }) => {
  const landedModal = new Modal((modal) => {
    const playAgain = () => { modal.close(); window.game.reset(); }
    return ({
      title: 'You did it!',
      content: [
        br(),
        p('Congratulations, Candidate!'),
        make('div', { className: 'indent', children: [
          p([
            'You successfully landed on the moon! Here are your stats:',
            ul([
              li(['It took you ', b(attempts), attempts === 1 ? ' try' : ' tries', ' to make it']),
              // li(['You spent a total of ', b(`$${cost}`), ' dollars, which is within your $2.5B budget']),
            ]),
          ]),
          p('We hope you enjoyed this simulation. Feel free to recruit your friends.'),
        ]}),
        p([
          'Thank you,', br(),
          'Jon Spaceman, Director of Engineering @ NASR'
        ]),
        br(),
      ],
      actions: [
        make('button', { className: 'accept', children: 'Play Again', onclick: playAgain }),
        make('button', { children: 'Close', onclick: () => modal.close() }),
      ],
      shortcuts: { ' ': playAgain, 'Enter': playAgain }
    })
  })

  setTimeout(() => landedModal.open(), 1000)
})