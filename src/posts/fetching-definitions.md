---
title: Fetching web component definitions
desc: I've been using a technique for a few years which passively fetches a web component definition once it is discovered on a page.
emoji: 📫
---

I love web components. Being able to just plop a custom element onto a page with all the functionality baked in without needing a framework or bundling to make it work is just liberating. I know there's a lot of overhead that comes with it that libraries and frameworks aim to abstract but I just enjoy having the low-level ability to do whatever you want.

The trickiest part of web components for me has been how to identify when a web components, which is written as HTML, needs to be defined through JavaScript. From a performance point-of-view, we don't want to send JavaScript to the page for components that aren't there. On the flip side, we don't want to miss components that apppear later in the lifecycle of the page.

The technique I'm about to explain is something I was working on at [Compass](https://compass.com) but was never completed. Since then I've also enhanced the approach to be a bit easier to setup.

## Registrar

The core of the approach uses an immediately invoked function expression (IIFE) which does a few things:

- Listens for new custom elements appearing on the page.
- Fetches definitions for elements that are not defined.
- Listens within new shadow roots for additional elements.

Let's describe how it does each of these.

### Listening for new custom elements

The [technique for detecting when an element appears in the DOM](https://davidwalsh.name/detect-node-insertion) is not new. It was first discovered by [Daniel Buchner](http://www.backalleycoder.com/) as early as 2012. This was the basis behind identifying when a custom element appears on the page with a few changes.

First, I use `visibility` as the trigger for the animation. The reason for this is because it is not commonly used for animations like `opacity` would be. This avoids possible conflicts where these elements would be animated more traditionally. So the declaration block that triggers the animation would begin to look like this:

```css
... {
  animation: undefined-detection .1ms;
}

@keyframes undefined-detection {
  to { visibility: visible; }
}
```

The missing piece is the selector to target these custom elements. In my original implementation, I would generate the list of elements to find here however, there is a better way. Because what we are looking for is custom elements that are undefined, there's a CSS selector that can target all of these.

```css
:not(:defined) {
  animation: undefined-detection .1ms;
}

@keyframes undefined-detection {
  to { visibility: visible; }
}
```

Yep, that's it. Now the `undefined-detection` animation will trigger for all custom elements that are not yet defined.

{% aside %}

### Greedy registration

I've noticed that custom elements that are on the page from extensions or other libraries will also attempt to be requested and ultimately fail since they aren't part of the library. This would be a benefit for having an explicit list of elements to listen for but the failures can be caught and ignored in this implementation or you could filter by prefix (i.e.; `ds-button` but not `random-button`).

{% endaside %}

So we will write this CSS to the `<head/>` of the page within the registrar and begin listening for the animation.

```js
const ANIMATION_NAME = 'undefined-detection';
const CSS = `
  :not(:defined) { animation: ${ANIMATION_NAME} } 
  @keyframes ${ANIMATION_NAME} { to { visibility: visible } }
`;

(function registrar() {
  function observe(root) {
    if (!root) return;
    root.addEventListener('animationstart', onAnimationStart);
    const styles = Object.assign(document.createElement('style'), {
      type: 'text/css',
      textContent: CSS,
    });
    document.head.insertBefore(styles, document.head.lastChild);
  }

  function onAnimationStart({ animationName, target }) {
    if (animationName !== ANIMATION_NAME) return;
    // tagName is the custom element name
    const tagName = target.tagName.toLowerCase();
    // target is the element identified
  }

  observe(document.documentElement);
})()
```

## Fetching the definition

This requires a bit of infrastructure. In my custom element library, each component is bundled into its own IIFE, available at `components/[COMPONENT_NAME].iife.js` in relation to the registrar. We can then determine the location of the components when the registrar is invoked with the following script. 

```js
const SOURCE_DIR = new URL(document.currentScript.src).href.replace(/[^/]*$/, '');
```

The code above determines the url where the current script is located and then removes the `registrar.iife.js` file name. I haven't found a cleaner way to do this without the ugly regex and without requiring to know the file name here. I wish browsers had the [`path` module from Node](https://nodejs.org/api/path.html).

Then we can determine the location of the components by building a url with this variable.

```js
const src = new URL(`components/${tagName}.iife.js`, SOURCE_DIR);
```

From there, it's easy to load the definition at this location. Here's what the registrar looks like with this included.

```js
const ANIMATION_NAME = 'undefined-detection';
const CSS = `
  :not(:defined) { animation: ${ANIMATION_NAME} } 
  @keyframes ${ANIMATION_NAME} { to { visibility: visible } }
`;
const SOURCE_DIR = new URL(document.currentScript.src).href.replace(/[^/]*$/, '');

(function registrar() {
  const elements = new Set();

  function observe(root) {
    if (!root) return;
    root.addEventListener('animationstart', onAnimationStart);
    const styles = Object.assign(document.createElement('style'), {
      type: 'text/css',
      textContent: CSS,
    });
    document.head.insertBefore(styles, document.head.lastChild);
  }

  function onAnimationStart({ animationName, target }) {
    if (animationName !== ANIMATION_NAME) return;
    const tagName = target.tagName.toLowerCase();
    register(tagName);
  }

  function register(tagName) {
    if (elements.has(tagName)) return;
    elements.add(tagName);
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      defer: true,
      onload: () => script.remove(),
      onerror: () => script.remove(),
      src: new URL(`components/${tagName}.iife.js`, SOURCE_DIR)
    });
    document.head.appendChild(script);
  }

  observe(document.documentElement);
})()
```

The additional parts added are to ensure we don't fetch definitions for things we are currently loading or have already loaded and to clean up the scripts being added to the page after they have completed.

## Handling shadow roots

So we've solved for when custom elements appear on the page but not when they appear within other custom elements. There's a little more work to do here.

When a custom element is identified, we'll want to listen inside of its shadow root for undefined elements. We can do that in the event trigger.

```js
function onAnimationStart({ animationName, target }) {
  if (animationName !== ANIMATION_NAME) return;
  const name = target.tagName.toLowerCase();
  register(name);

  // When the custom element is defined, begin looking for custom elements within
  window.customElements.whenDefined(name).then(() => observe(target.shadowRoot));
}
```

This will also require us to change the `observe` function since shadow roots do not have a `<head/>`. This is what the final registrar function looks like.

```js
const ANIMATION_NAME = 'undefined-detection';
const CSS = `
  :not(:defined) { animation: ${ANIMATION_NAME} } 
  @keyframes ${ANIMATION_NAME} { to { visibility: visible } }
`;
const SOURCE_DIR = new URL(document.currentScript.src).href.replace(/[^/]*$/, '');

(function registrar() {
  const elements = new Set();

  // Determine the anchor and target to set the resources
  function location(root) {
    return root === document.documentElement
      ? { anchor: document.head, target: document.head.lastChild }
      : { anchor: root, target: root.firstChild };
  }

  function observe(root) {
    if (!root) return;
    root.addEventListener('animationstart', onAnimationStart);
    const styles = Object.assign(document.createElement('style'), {
      type: 'text/css',
      textContent: CSS,
    });

    // Here's where we determine where to attach the resources
    const { anchor, target } = location(root);
    anchor.insertBefore(styles, target);
    window.customElements.whenDefined(name).then(() => observe(target.shadowRoot));
  }

  function onAnimationStart({ animationName, target }) {
    if (animationName !== ANIMATION_NAME) return;
    const tagName = target.tagName.toLowerCase();
    register(tagName);
  }

  function register(tagName) {
    if (elements.has(tagName)) return;
    elements.add(tagName);
    const script = Object.assign(document.createElement('script'), {
      type: 'text/javascript',
      defer: true,
      onload: () => script.remove(),
      onerror: () => script.remove(),
      src: new URL(`components/${tagName}.iife.js`, SOURCE_DIR)
    });
    document.head.appendChild(script);
  }

  observe(document.documentElement);
})()
```

## Missing pieces

One edge case that this approach might not catch is when custom elements are dynamically added to defined elements.

In other words, if `<my-element>` appears on the page, we define it and immediately add the listener to _only_ that shadow root. While it does determine if any custom elements within its lifecycle need definitions, later `<my-element>` components added to the page will already be defined and therefore not trigger dynamically added custom elements within those later components (because the triggering resources aren't added to subsquent shadow roots).

To have true coverage, the triggering resources would need to be added to _all_ shadow roots. Luckily, this could be solved by importing the node detection CSS separately within each component which will trigger the registrar to fetch the definition; something that could be part of the library building script.

```js
import CSS from '../registrar.js';
class MyElement extends window.HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `<style type="text/css">${CSS}</style>`;
  }
}
window.customElements.define('my-element', MyElement);
```

{% aside %}

### Listening for defined

You may have considered another approach to use node detection to just look for defined elements.

```css
:defined {
  animation: defined-detection .1ms;
}
```

From there we could just add the target resources to each element; skipping the `customElements.whenDefined` check since the CSS animation trigger should catch it instead.

```js
root.addEventListener('animationend', ({ animationName, target }) => {
   if (animationName !== 'defined-detection') return;
   observe(target.shadowRoot);
})
```

There's one catch, the `:defined` selector will trigger for _all elements_ (`<html/>`, `<div/>`, `<p/>`, etc.) and for every single one of them found on the page. While you could certainly filter for specific custom elements with open shadow roots, it's still a lot of callbacks firing. Another reason why having a list of elements to update or pre-updating with the triggering resources seems to be better approaches.

{% endaside %}

## All together now

Once you have the files bundled and deployed, you can just add the registrar to each page and it'll begin fetching definitions. I'll add `defer` so it doesn't block the page from loading.

```html
<script src="registrar.iife.js" defer>
```

And that's it, we're automagically getting the definitions for web components on-demand!