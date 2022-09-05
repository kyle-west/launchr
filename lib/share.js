import { make } from './dom.js';

const url = 'https://launchr.vercel.app/'

async function onClick (msgBox) {
  let msg
  if (!navigator.canShare) {
    await navigator.clipboard.writeText(url)
    msg = 'Link copied!'
  } else {
    await navigator.share({
      title: 'LaunchR - Rocket Simulator',
      url
    })
    msg = 'Shared!'
  }

  msgBox.innerHTML = msg;
  msgBox.style.opacity = 0.7
  setTimeout(() => {
    msgBox.style.opacity = 0
  }, 3000)
}

customElements.define('social-share',
  class SocialShare extends HTMLElement {
    connectedCallback() {
      const msgBox = make('span', { className:'msg-box', style: { position: 'absolute', margin: '14px', opacity: 0, transition: 'opacity 0.3s' } })
      this.appendChild(make('button', { className: 'share', children: this.text || 'Share', onclick: () => onClick(msgBox) }));
      this.appendChild(msgBox)
    }
  }
);
