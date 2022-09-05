import { Painter, randGrey } from './canvas.js';
import { LandingEvent, LaunchEvent, ResetEvent } from './events.js';

const G = 0.5
let LAUNCH_ATTEMPTS = 0

const updateAngleUI = (value) => document.getElementById('write-angle').innerHTML = value
document.getElementById('angle').oninput = ({ target: {value} }) => updateAngleUI(value)

const rand = (max, min = 0) => Math.random() * (max - min) + min;
const randItem = items => items[Math.floor(Math.random()*items.length)];
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const distance = ([x1, y1], [x2, y2]) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

function getThrust() {
  const angle = (+(document.getElementById('angle').value) + 90) * (- Math.PI / 180)
  const thrust = +(document.getElementById('thrust').value)
  const vx = - thrust * Math.cos(angle)
  const vy = thrust * Math.sin(angle)
  return [vx, vy]
}

const inc = (id, amount) => {
  const elem = document.getElementById(id)
  const min = +elem.min
  const max = +elem.max
  const value = +elem.value
  const newVal = clamp(min, value + amount, max)
  document.getElementById(id).value = newVal
  id === 'angle' && updateAngleUI(newVal)
}

document.getElementById('thrust-inc').onclick = () => inc('thrust', 1)
document.getElementById('thrust-dec').onclick = () => inc('thrust', -1)

function init () {
  const cleanup = []
  LAUNCH_ATTEMPTS = 0

  const paint = new Painter(document.getElementById('screen'))
  cleanup.push(() => paint.init())

  const GROUND = {
    height: 10,
    pos: [0, paint.MAX_Y - 10],
    size: [10, paint.MAX_X],
  }
  
  const MOON = {
    pos: [(paint.MAX_X + 25) / 2, 150],
    size: 25
  }
  
  const Y_LIMIT =  paint.MAX_Y - GROUND.height - 5;
  const X_LIMIT_L = 0 + 5;
  const X_LIMIT_R = paint.MAX_X - 5;

  const makeStars = (length) => Array.from({ length }).map(() => {
    let x = rand(X_LIMIT_R)
    let y = rand(Y_LIMIT * 0.78)
    return [ randGrey(), x, y, 1 ]
  })

  const handleKeys = ({target, key}) => {
    if (target.id === 'launch' || target.tagName === 'INPUT') return
  
    switch (key) {
      case ' ': 
      case 'Enter': 
        return  launch()
  
      case 'ArrowLeft': 
      case 'a': 
        return inc('angle', -1);
      case 'ArrowRight':
      case 'd':
        return inc('angle', 1);
      case 'ArrowUp':
      case 'w':
        return inc('thrust', 1);
      case 'ArrowDown': 
      case 's': 
        return inc('thrust', -1);
    }
  }
  window.addEventListener('keydown', handleKeys)
  cleanup.push(() => window.removeEventListener('keydown', handleKeys))
  document.getElementById('launch').onclick = launch
  
  class Rocket {
    constructor(x,y) {
      this.pos = [x,y]
      this.vel = [0,0]
      this.inFlight = false
      // this.cost = 0
    }
  
    paint() {
      const [x , y] = this.pos
      
      const L = x - 5
      const R = x + 5
      const T = y -15
      const B = y + 5
  
      paint.tri('red', [x, T], [R, B], [L, B])
      paint.rect('#42adf5', L, B, 5, 10)
      
      if (this.inFlight) {
        const randPoint = () => [rand(R+3, L-3), rand(B, T) + 25]
        const randTriangle = () => [randPoint(), randPoint(), randPoint()]
        paint.tri(randItem(['#ff5100', '#ffa200', '#ffe600']), ...randTriangle())
        paint.tri(randItem(['#ff5100', '#ffa200', '#ffe600']), ...randTriangle())
        paint.tri(randItem(['#ff5100', '#ffa200', '#ffe600']), ...randTriangle())
      }
    }
  
    applyPhysics() {
      const [x  , y] = this.pos
      const [vx, vy] = this.vel
      this.vel = [vx, vy + G]
      this.pos = [clamp(X_LIMIT_L, x + vx, X_LIMIT_R), clamp(-Infinity, y + vy, Y_LIMIT)]
      const grounded = this.pos[1] === Y_LIMIT
      const landed = this.checkLanded()
      if (grounded || landed) {
        endLaunch(landed)
        this.vel = [0, 0]
      }
    }
  
    checkLanded () {
      const [, vy] = this.vel
      if (vy >= 0) {
        return distance(this.pos, MOON.pos) <= MOON.size * 0.9
      }
      return false
    }
  }
  
  const sky = paint.brush.createLinearGradient(0, 0, 0, paint.MAX_Y)
        sky.addColorStop(0, "#000")
        sky.addColorStop(0.8, "#000")
        sky.addColorStop(1, '#6fbbd3')
  
  const stars = makeStars(300)
  
  function paintScene() {
    paint.clear(sky)
    stars.forEach(star => paint.circ(...star))
    paint.rect('green', ...GROUND.pos, ...GROUND.size)
    paint.circ('#eee', ...MOON.pos, MOON.size)
  } 
  
  const player = new Rocket(X_LIMIT_R * 0.2, Y_LIMIT) // right above the LAUNCH button
  
  function launch() {
    if (!player.inFlight && !document.body.classList.contains('overlayOpen')) {
      player.vel = getThrust()
      player.inFlight = true
      LAUNCH_ATTEMPTS++
      document.dispatchEvent(new LaunchEvent({ attempts: LAUNCH_ATTEMPTS, position: player.pos }))
    }
  }
  function endLaunch(landed) {
    if (landed && player.inFlight) {
      console.log(`LANDED after ${LAUNCH_ATTEMPTS} attempt(s)`)
      document.dispatchEvent(new LandingEvent({ attempts: LAUNCH_ATTEMPTS }))
    }
    player.inFlight = false
  }

  function render() {
    paintScene()
    player.paint()
    player.applyPhysics()
  }

  return [render, () => cleanup.map(clean => clean()) ]
}

function runGame () {
  const [render, cleanup] = init()
  let currentFrame;
  function game() {
    render()
    currentFrame = window.requestAnimationFrame(game)
  }
  game()
  return () => {
    cancelAnimationFrame(currentFrame)
    cleanup()
  }
}

export class Game {
  constructor () {
    this.handleCancel = null;
    window.addEventListener('resize', () => this.reset())
  }

  run() {
    this.handleCancel = runGame()
  }

  reset () {
    this.handleCancel?.()
    document.dispatchEvent(new ResetEvent())
    this.run()
  }
}