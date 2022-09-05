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
document.addEventListener(ResetEvent.name, () => {
  document.getElementById('write-cost').innerHTML = 0
  document.getElementById('write-attempts').innerHTML = 0
})

// get focus off of elements when clicked because they interfere with keyboard controls
;[...document.querySelectorAll('input, button')].forEach(input => input.addEventListener('click', () => input.blur()))

document.addEventListener(LandingEvent.name, ({ attempts, cost }) => {
  const underBudget = cost <= 2_500_000_000
  if (attempts === 1) {
    window.sessionStorage.playerMadeItInOneTry = true
  }
  const landedModal = new Modal((modal) => {
    const playAgain = () => { modal.close(); window.game.reset(); }
    return ({
      title: underBudget ? 'You did it!': 'Not quite there yet...',
      content: [
        br(),
        underBudget ? p('Congratulations, Candidate!'): p('Dear Candidate,'),
        make('div', { className: 'indent', children: [
          p([
            underBudget ? 'You successfully landed on the moon! Here are your stats:'
                        : 'You landed on the moon, but it was not ideal. Here are your stats:',
            ul([
              li(['It took you ', b(attempts), attempts === 1 ? ' try' : ' tries', ' to make it.', underBudget ? ' Great Job!' : '']),
              li([
                'You spent a total of ', b(`$${cost.toLocaleString('en-US')}`),
                ` which was ${underBudget ? 'within' : 'over'} your $2.5B budget${underBudget ? '!' : '.'}`
              ]),
            ]),
          ]),
          underBudget ? p('We hope you enjoyed this simulation. Feel free to recruit your friends.')
                      : p('Please try again. We are sure you can make it with a little more effort!'),
        ]}),
        p([
          'Thank you,', br(),
          'Jon Spaceman - Director of Engineering, NASR'
        ]),
        br(),
      ],
      actions: [
        make('button', { className: 'accept', children: 'Play Again', onclick: playAgain }),
        make('social-share'),
        make('button', { className: 'other', children: 'Close', onclick: () => modal.close() }),
      ],
      shortcuts: { ' ': playAgain, 'Enter': playAgain }
    })
  })

  setTimeout(() => landedModal.open(), 1000)
})


// For development and testing purposes
window.test = window.test || {}
window.test.fireLandingEvent = ({ attempts, cost }) => document.dispatchEvent(new LandingEvent({ attempts, cost }))
