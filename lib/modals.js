import { make, p, br, i, b, kbd, ul, li, isMobile, } from './dom.js'

export class Modal {
  constructor (generateData) {
    this.data = generateData(this)
  }

  open () {
    document.body.classList.add('overlayOpen')
    this.isOpen = true
    this.render()
    
    this.handleKeys = (event) => {
      const { key } = event
      if (key === 'Escape') this.close()
      
      Object.entries(this.data?.shortcuts || {}).forEach(([k, action]) => {
        if (k === key) action(event)
      })
    }
    window.addEventListener('keydown', this.handleKeys)
  }
  
  close () {
    document.body.classList.remove('overlayOpen')
    this.isOpen = false
    this.render()
    window.removeEventListener('keydown', this.handleKeys)
  }

  render () {
    const { elem, isOpen, data } = this

    if (elem) elem.remove()

    if (isOpen) {
      const { title, content, actions = [] } = data || {}
      this.elem = make('div', { className: 'modalWrapper', children: [
        make('div', { className: 'scrim' }),
        make('div', { className: 'modal', children: [
          make('h1', { className: 'title', children: title }),
          make('div', { className: 'content', children: content }),
          make('div', { className: 'actions', children: actions }),
        ]})
      ]})
      document.body.appendChild(this.elem)
    }
  }
}

export const welcomeModal = new Modal((modal) => ({
  title: 'NASR Welcomes You Today',
  content: [
    br(),
    p('Dear Candidate,'),
    make('div', { className: 'indent', children: [
      p([
        'The ', i('National Administration of Space Rockets'),
        ' invites you to test your skills in our Rocket Launch Simulator. ',
      ]),
      p([
        'OBJECTIVE: ', b('land your rocket on the Moon. '),
        br(), 'BUDGET: You are allotted ', b('$2.5 billion dollars'), ' to cover fuel and launch costs.'
      ]),
      isMobile() ?
        p([
          'Use the controls on screen to adjust the ', b('thrust'), ' and ', b('angle'),' parameters of the launch.',
        ]) :
        p([
          'Use your keyboard to control the thrust and angle parameters of the launch. ',
          ul([
            li([
              kbd('Left'), ' and ', kbd('Right'), ' (or ', kbd('A'),'/', kbd('D'), 
              ') adjust the ', b('launch angle'),
            ]),
            li([
              kbd('Up'), ' and ', kbd('Down'), ' (or ', kbd('W'),'/', kbd('S'), 
              ') adjust the amount of ', b('thrust'), ' applied to the rocket'
            ]),
            li([
              kbd('Space'), ' or ', kbd('Enter'), ' will fire the launch'
            ]),
          ]),
        ]),
      p('Best of luck to you. Feel free to make multiple attempts, if needed.'),
    ]}),
    p([
      'Sincerely,', br(),
      'Jon Spaceman - Director of Engineering, NASR'
    ]),
    br(),
  ],
  actions: [
    make('button', { className: 'accept', children: 'Accept Challenge', onclick: () => modal.close() })
  ],
  shortcuts: {
    ' ': () => modal.close(),
    'Enter': () => modal.close(),
  }
}))
