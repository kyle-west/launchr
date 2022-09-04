export class Painter {
  constructor(elem) {
    if (!elem) throw new Error('Canvas not found, unable to create context')
    this.elem = elem
    this.init()
  }

  init() {
    const { elem } = this
    this.MAX_Y = elem.height = elem.clientHeight
    this.MAX_X = elem.width = elem.clientWidth
    this.ctx = elem.getContext("2d");
    console.log('init', this.MAX_X, this.MAX_Y)
    this.clear()
  }

  rect (color, x, y, w, h) {
    let oldColor = this.ctx.fillStyle; 
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x,y,h,w);
    this.ctx.fillStyle = oldColor;
  }
  
  circ (color, x, y, r) {
    let oldColor = this.ctx.fillStyle; 
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.fillStyle = oldColor;
  }
  
  tri (color, top, right, left) {
    let oldColor = this.ctx.fillStyle; 
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(...top);
    this.ctx.lineTo(...right);
    this.ctx.lineTo(...left);
    this.ctx.fill();
    this.ctx.fillStyle = oldColor;
  }

  clear (color = 'black') {
    this.rect(color, 0,0, this.MAX_Y, this.MAX_X)
  }

  get brush () {
    return this.ctx
  }
}

export function randGrey() {
  var v = (Math.random()*(256)|0).toString(16);
  return "#" + v + v + v;
}