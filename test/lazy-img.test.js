import '../src/lazy-img.js';

describe('lazy-img', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('lazy-img');

    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should attach an observer and remove an existing observer', () => {
    const spy = sinon.spy(element, 'removeObserver');

    assert.equal(element.observer instanceof IntersectionObserver, true);
    assert.equal(element.removeObserver.called, false);

    element.attachObserver();
    assert.equal(element.removeObserver.called, true);

    spy.restore();
  });

  it('should remove an existing observer', () => {
    assert.equal(element.observer instanceof IntersectionObserver, true);

    element.removeObserver();

    assert.equal(element.observer, null);
  });

  it('should remove the observer and dispatch a "load" event when the image is loaded', () => {
    const spy1 = sinon.spy(element, 'removeObserver');
    const spy2 = sinon.spy(element, 'dispatchEvent');

    const event = new CustomEvent('load', {
      composed: true,
      bubbles: true
    });

    element.onImageLoaded();

    assert.equal(element.removeObserver.called, true);
    assert.deepEqual(element.dispatchEvent.calledWith(event), true);

    spy1.restore();
    spy2.restore();
  });

  it('should load the image through "setTimeout" when the element is fully visible', (done) => {
    const spy = sinon.spy(element, 'loadImage');
    assert.equal(element.timer, undefined);

    element.delay = 500;
    element.handleIntersection([{intersectionRatio: 1}]);

    assert.equal(Number.isInteger(element.timer), true);

    setTimeout(() => {
      assert.equal(element.loadImage.called, true);
      spy.restore();

      done();
    }, element.delay);
  });

  it('should cancel loading of the image when the element is scrolled out of view', () => {
    const spy = sinon.spy(window, 'clearTimeout');
    element.timer = 12345;

    element.handleIntersection([{intersectionRatio: 0}]);

    assert.equal(window.clearTimeout.called, true);
    assert.equal(element.timer, null);

    spy.restore();
  });

  it('should set the "src" attribute on the image only when it is present on the element', () => {
    const src = 'foo.jpg';
    element.loadImage();

    assert.equal(element.image.getAttribute('src'), null);

    element.setAttribute('src', src);
    element.loadImage();

    assert.equal(element.image.getAttribute('src'), src);
  });

  it('should set dimensions on the image and container when the "width" and "height" attributes change' , () => {
    assert.equal(element.image.hasAttribute('width'), false);
    assert.equal(element.image.hasAttribute('height'), false);

    element.attributeChangedCallback('width', null, 640);
    element.attributeChangedCallback('height', null, 480);

    assert.equal(element.image.getAttribute('width'), '640');
    assert.equal(element.image.getAttribute('height'), '480');
    assert.equal(element.container.style.width, '640px');
    assert.equal(element.container.style.height, '480px');
  });

  it('should set the loading delay when the "delay" attribute changes', () => {
    assert.equal(element.delay, 500);

    element.setAttribute('delay', '750');
    assert.equal(element.delay, 750);
  });

  it('should remove the "src" attribute from the image to unload it', () => {
    element.image.setAttribute('src', 'foo.jpg');

    element.unloadImage();

    assert.equal(element.image.hasAttribute('src'), false);
  });
});
