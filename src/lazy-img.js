export default class LazyImg extends HTMLElement {

  static get observedAttributes() {
    return ['margin', 'delay', 'width', 'height'];
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <style>
          :host {
            display: block;
            --placeholder-background: #cccccc;
            --spinner-color: #808080;
          }
          #container {
            width: 100%;
            height: 100%;
            background: var(--placeholder-background);
          }
          #image {
            visibility: hidden;
            opacity: 0;
            width: 0;
            height: 0;
            transition: opacity 0.3s ease-out;
          }
          #image.loaded {
          visibility: visible;
            opacity: 1;
            width: 100%;
            height: 100%;
          }
          #loader {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          #spinner {
            box-sizing: border-box;
            stroke: var(--spinner-color);
            stroke-width: 3px;
            transform-origin: 50%;
            animation: line 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite, rotate 1.6s linear infinite;
          }
          @keyframes rotate {
            from {
              transform: rotate(0); 
            }
            to {
              transform: rotate(450deg);
            }
          }
          
          @keyframes line {
            0% {
              stroke-dasharray: 2, 85.964;
              transform: rotate(0);
            }
            50% {
              stroke-dasharray: 65.973, 21.9911;
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dasharray: 2, 85.964;
              stroke-dashoffset: -65.973;
              transform: rotate(90deg);
            }
          }
      </style>
        
        <div id="container">
          <img id="image">
          <div id="loader">
            <svg viewBox="0 0 32 32" width="32" height="32">
              <circle id="spinner" cx="16" cy="16" r="14" fill="none"></circle>
            </svg>
          </div>
        </div>
            
        `;

    this.observer = null;

    this.options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.0, 1.0]
    };

    this.delay = 500;

    this.container = this.shadowRoot.querySelector('#container');
    this.image = this.shadowRoot.querySelector('#image');
    this.loader = this.shadowRoot.querySelector('#loader');
  }

  connectedCallback() {
    this.image.addEventListener('load', this.onImageLoaded.bind(this));

    if(!('IntersectionObserver' in window)) {
      this.loadImage();
    }
    else {
      this.attachObserver();
    }
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if((attr === 'width' || attr === 'height') && newVal) {
      this.image.setAttribute(attr, newVal);
      this.container.style[attr] = `${newVal}px`;
    }

    if(attr === 'delay' && newVal) {
      this.delay = parseInt(newVal, 10);
    }

    if(attr === 'margin' && newVal) {
      this.options.rootMargin = newVal;
      this.attachObserver();
    }
  }

  attachObserver() {
    if(this.observer) {
      this.removeObserver();
    }

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.options);
    this.observer.observe(this.container);
  }

  removeObserver() {
    this.observer.unobserve(this.container);
    this.observer = null;
  }

  onImageLoaded() {
    this.loader.style.display = 'none';
    this.image.style.display = 'block';
    setTimeout(() => this.image.classList.add('loaded'), 100);

    this.removeObserver();

    this.dispatchEvent(new CustomEvent('load', {
      composed: true,
      bubbles: true
    }));
  }

  handleIntersection(entries) {
    entries.forEach(({intersectionRatio}) => {
      if(intersectionRatio === 0) {
        if(this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
      }
      else if(intersectionRatio === 1) {
        this.timer = setTimeout(this.loadImage.bind(this), this.delay);
      }
    });

  }

  loadImage() {
    if(this.hasAttribute('srcset')) {
      this.image.srcset = this.getAttribute('srcset');

      if(this.hasAttribute('sizes')) {
        this.image.sizes = this.getAttribute('sizes');
      }
    }
    if(this.hasAttribute('src')) {
      this.image.src = this.getAttribute('src');
    }
  }
}

customElements.define('lazy-img', LazyImg);
