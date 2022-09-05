function attach (elem, item) {
  if (!item || item === true) return;
  if (item instanceof Array) {
    item.forEach(child => attach(elem, child))
  } else if (item instanceof Node) {
    elem.appendChild(item)
  } else {
    elem.appendChild(document.createTextNode(item.toString()))
  }
}

export function make (type, { children = [], ...props } = {}, attrs = {}) {
  let elem = document.createElement(type)
  Object.assign(elem, props)
  attach(elem, children)
  Object.entries(attrs).forEach(([k,v]) => elem.setAttribute(k,v))
  return elem
}

export const h1 = (children) => make('h1', { children })
export const h2 = (children) => make('h2', { children })
export const h3 = (children) => make('h3', { children })
export const h4 = (children) => make('h4', { children })
export const h5 = (children) => make('h5', { children })
export const h6 = (children) => make('h6', { children })

export const p = (children) => make('p', { children })
export const b = (children) => make('strong', { children })
export const i = (children) => make('em', { children })
export const br = () => make('br')
export const kbd = (children) => make('kbd', { children })
export const ul = (children) => make('ul', { children })
export const li = (children) => make('li', { children })


export const isMobile = () => document.body.clientWidth <= 600
