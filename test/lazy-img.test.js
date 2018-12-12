import '../src/lazy-img.js';

describe('lazy-img', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('img', {is: 'lazy-img'});

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

    assert.equal(element.getAttribute('src'), null);

    element.setAttribute('data-src', src);
    element.loadImage();

    assert.equal(element.getAttribute('src'), src);
  });

  it('should set the "srcset" and "sizes" attributes on the image only when present on the element', () => {
    const srcset = 'foo.jpg 100vw';
    const sizes = '100vw';
    element.loadImage();

    assert.equal(element.getAttribute('srcset'), null);
    assert.equal(element.getAttribute('sizes'), null);

    element.setAttribute('data-srcset', srcset);
    element.setAttribute('data-sizes', sizes);
    element.loadImage();

    assert.equal(element.getAttribute('srcset'), srcset);
    assert.equal(element.getAttribute('sizes'), sizes);
  });


  it('should set the loading delay when the "delay" attribute changes', () => {
    assert.equal(element.delay, 500);

    element.setAttribute('delay', '750');
    assert.equal(element.delay, 750);
  });

  it('should set the "rootMargin" on the IntersectionObserver options and reattach it', () => {
    const spy = sinon.spy(element, 'attachObserver');
    const margin = '10px';
    element.setAttribute('margin', margin);

    assert.equal(element.options.rootMargin, margin);
    assert.equal(element.attachObserver.called, true);

    spy.restore();
  });
});
