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

### Usage
```
<lazy-img
          src="path/to/img.jpg"
          width="480"
          height="320"
          delay="500"
          margin="0px"></lazy-img>
```

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

