export class LandingEvent extends CustomEvent {
  constructor(detail = {}) {
    super(LandingEvent.name, { detail })
    Object.assign(this, detail)
    console.log(LandingEvent.name, 'MERP')
  }
  static get name () {
    return 'rocket-landed'
  }
}

document.addEventListener(LandingEvent.name,
  ({ attempts }) => window.requestAnimationFrame(() => alert(`Yay! You Landed! It took ${attempts} ${attempts === 1 ? 'try' : 'tries'}`)
))
