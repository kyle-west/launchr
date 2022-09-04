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
export const ResetEvent = makeEventType('reset-game')

document.addEventListener(LandingEvent.name,
  ({ attempts }) => window.requestAnimationFrame(() => alert(`Yay! You Landed! It took ${attempts} ${attempts === 1 ? 'try' : 'tries'}`)
))

document.addEventListener(LaunchEvent.name, ({ attempts }) => document.getElementById('write-attempts').innerHTML = attempts)
document.addEventListener(ResetEvent.name, () => document.getElementById('write-attempts').innerHTML = 0)
