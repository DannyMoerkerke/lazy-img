export default class LazyImg extends HTMLImageElement {

  static get observedAttributes() {
    return ['threshold', 'delay'];
  }

  constructor() {
    super();

    this.observer = null;

    this.options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.0, 1.0]
    };

    this.delay = 500;
  }

  connectedCallback() {
    this.addEventListener('load', this.removeObserver.bind(this));

    if(!('IntersectionObserver' in window)) {
      this.loadImage();
    }
    else {
      this.attachObserver();
    }
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if(attr === 'delay' && newVal) {
      this.delay = parseInt(this.getAttribute('delay'), 10);
    }
  }

  attachObserver() {
    if(this.observer) {
      this.removeObserver();
    }

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
    this.observer.observe(this);
  }

  removeObserver() {
    this.observer.unobserve(this);
    this.observer = null;
  }

  handleIntersection(entries) {
    entries.forEach(({intersectionRatio}) => {
      if(intersectionRatio === 0) {
        console.log('out of view');
        if(this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      }
      else {
        if(intersectionRatio === 1) {
          console.log('in view');
          this.timer = setTimeout(this.loadImage.bind(this), this.delay);
        }
      }
    });

  }

  loadImage() {
    if(this.hasAttribute('data-src')) {
      this.src = this.getAttribute('data-src');
    }
  }
}

customElements.define('lazy-img', LazyImg, {extends: 'img'});
