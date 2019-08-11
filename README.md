## lazy-img Custom Element
lazy-img is a Custom Element which lazily loads an image once it it fully
visible in the browser's viewport.

Internally it uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to determine the visibility of
the image.

By default it will only load the image when the placeholder is fully
visible after a delay of 500ms to account for when the image becomes
visible but is then quickly scrolled out of view. This means the image
will only be loaded after the placeholder has been fully visible for at
least 500ms.

Note that for the IntersectionObserver to indicate the image is fully
visible it needs to be fully visible on **all** sides in the viewport.
If the image is very wide for example and its width does not fit in
the viewport, it will **not** be considered fully visible and the image will
not be loaded.

### Demo page
First run `npm install`, then `npm start` to view the demo page at
[http://localhost:8080](http://localhost:8080)

### Tests
Run `npm test` and view the test page at
[http://localhost:8080](http://localhost:8080)

This repo also contains the configuration file `wallaby.js` to run the
tests from your IDE using [Wallaby.js](https://wallabyjs.com/)

To run the tests from the command line: `npm run test:headless`
### Usage
Install with `npm install @dannymoerkerke/lazy-img`


```
<lazy-img
          src="path/to/img.jpg"
          width="480"
          height="320"
          delay="500"
          margin="0px"></lazy-img>
```

The `extend-native` branch contains lazy-img as a Custom Element which
extends the native `<img>` element. It does not need a separate tag but
only an `is` attribute:

```
<img is="lazy-img
     src="path/to/img.jpg"
     width="480"
     height="320"
     delay="500"
     margin="0px"></img>
```
Currently this is only supported in recent versions of Chrome and
Firefox.

### Attributes
- `src`: path to the image
- `width`: width in pixels
- `height`: height in pixels
- `delay`: delay in ms before the element loads the image (default: 500ms)
- `margin`: the `rootMargin` of the IntersectionObserver (default: 0px)

`delay` is needed for when the image is scrolled into view and then quickly
scrolled out of view. Without a delay, the image would immediately be
loaded even though it would no longer be visible.

This situation can occur when a user quickly scrolls down the page with
the images quickly scrolling into and out of the viewport. The delay assures
that only images that are fully visible for at least 500ms are loaded.

`margin` corresponds to the `rootMargin` property of the IntersectionObserver
and is used to enlarge or shrink the box around the observed element in
which the intersection is calculated.

By setting a large box for example, the observer will report the element
as fully visible even though only a small part will be visible. The default
value is 0px and it can be set like CSS margin (top, right, bottom, left)
and **must** include either `px` or `%`.

### Styling
The component exposes the following CSS variables:
- `--placeholder-background`: the color of the placeholder that is
visible before the image is loaded (default: #cccccc)
- `--spinner-color`: the color of the spinner that is visible before
the image is loaded (default: #808080)
