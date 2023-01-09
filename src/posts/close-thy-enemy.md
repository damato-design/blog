---
title: Close thy enemy
desc: A recent bug turns into a realization that most close buttons across the web are engineered poorly.
heat: 1
date: 2023-01-09
---

You've seen it before, an 'x' at the corner of a surface which will allow the user to exit that surface. In design, it seems simple to just place the button at the top corner. To engineer this, we have a few options:

## Absolute Position

The first option most folks might consider is something like the following:

```css
.surface {
  position: relative;
}

.surface button.close {
  position: absolute;
  /* https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties */
  inset-block-start: 0; /* logical property for "top" */
  inset-inline-end: 0; /* logical property for "right" */
}
```

Many design system component libraries use this approach:

- [Ant Design System](https://ant.design/components/modal)
- [Base Web (Uber)](https://baseweb.design/components/modal/)
- [Carbon Design System (IBM)](https://carbondesignsystem.com/components/modal/code/)
- [Chakra UI](https://chakra-ui.com/docs/components/modal/usage)
- [Github Primer](https://primer.style/react/Dialog)
- [Reach UI](https://reach.tech/dialog/)
- [Stacks (StackOverflow)](https://stackoverflow.design/product/components/modals/)

The problem with this approach is the way that `position: absolute` works. When applying `position: absolute;` to an element, it takes that element out of the normal flow of the document. This means that other elements cannot interact with this element.

In some configurations for the above components, the content (usually the title) _could_ appear visually layered below the close button.

![Curated text that visually collides with the close button in Github Primer](../images/modal-button-collide.png)

{% aside "warning" %}
Even if you think you control the content, assume that you don't. User preferences can influence the content display, either by size, translation, or otherwise. Be prepared for the content to vary.
{% endaside %}

Some implementations solve this for by providing enough padding to the content area so the button never collides. However, this often results in an imbalance of padding and may not be desirable from design.

![Text never touches the far edge because there's more padding for the close button in IBM Carbon](../images/modal-padding-imbalance.png)

## Flex header

Another method is to add the button as a flex child to a header of the surface. 

```css
.surface .header {
  display: flex;
}

.surface .header button.close {
  margin-inline-start: auto;
}
```

Here's a list of components across design systems using this approach:

- [Atlassian Design](https://atlassian.design/components/modal-dialog/examples)
- [Microsoft Fluent](https://developer.microsoft.com/en-us/fluentui#/controls/web/modal)
- [Twilio Paste](https://paste.twilio.design/components/modal/)
- [Shopify Polaris](https://polaris.shopify.com/components/modal#navigation)
- [Shoelace UI](https://shoelace.style/components/dialog)

While this avoids a collision between the button and content, it also requires that the header exist which will be at least the height of the close button. In cases where additional header content doesn't exist this displays a large forehead before the content.

![Removing title results in large space above the content in Twilio Paste](../images/modal-large-forehead.png)

So if the surface doesn't have a title, the amount of space might not be desirable by design. Certainly, if design is attempting to curate the title, this might have some control. However, incorrect alignment could also result in the close button centering within the header instead of pinning to the corner.

![A large amount of header content can visually center button in Shoelace UI](../images/modal-centered-header.png)

## Unique alternatives

There are some other approaches. [Salesforce Lightning includes the button outside the modal](https://www.lightningdesignsystem.com/components/modals/) which might not work for other surfaces. [Their alert component](https://www.lightningdesignsystem.com/components/alert/) uses the `position: absolute;` technique as an example which will have similar problems as described above. [Adobe Spectrum avoids the 'x' button entirely](https://spectrum.adobe.com/page/alert-dialog/) and provides an explicit action to close the surface. However, [their alert component](https://spectrum.adobe.com/page/in-line-alert/) suffers from problems using the icon accessory in relation to the title in this similar layout.

![A large amount of header content can shrink the icon in Adobe Spectrum](../images/modal-alert-icon.png)

## The "buoyant" approach

Let's be clear about some requirements. If design is expecting a close button to appear at the top corner:

- Padding around the surface should be visually consistent.
- The close button should never move from the corner.
- The content in the surface should not collide with the close button.

{% aside %}
These requirements are meant for surfaces that are text heavy. A surface which has a full-bleed media (eg., image or video) which spans the width of the surface will have other problems. The normal `position: absolute;` treatment would probably work well in this case and then ensuring that the button has sufficient contrast against the media it appears above.
{% endaside %}

We can leverage two features of CSS to get an intended result.

### Recent relative ancestor

In order to get an element to be positioned relative to another, we need to create a relationship. In the case of `position: absolute;` this relation doesn't need to be between a direct parent and child. It can be **any ancestor**. This means we can have a distant child be positioned to ancestor located up the tree.

```css
.surface {
  position: relative;
}

.surface button.close {
  position: absolute;
}
```

This is no different from the methods we've critized above _except_ that the `button.close` element is a child of another element; our secret sauce...

### Floats!

The way we get text to wrap around elements is by using  the `float` property. We'll float the button toward the right, so that content moves around it.

```css
span.floater {
  float: right; /* inline-end */
}
```

{% aside %}
While we'd like to use CSS Logical Properties for the float, [they aren't well supported](https://developer.mozilla.org/en-US/docs/Web/CSS/float#browser_compatibility). You'll probably need to adjust the type of float based on the `dir`.

```css
[dir="rtl"] span.floater {
  float: left;
}
```

{% endaside %}

Then our HTML should be setup in the following manner:

```html
<div class="surface">
  <span class="floater">
    <button class="close">×</button>
  </span>
  <!-- Surface content goes here -->
</div>
```

You'll need a bunch of other styles to finesse the size of the floating element and button in relation to the content. The final result should look something like this:

<iframe height="500" style="width: 100%;" scrolling="no" title="buoyant button" src="https://codepen.io/fauxserious/embed/ExpWjzL?default-tab=html%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/fauxserious/pen/ExpWjzL">
  buoyant button</a> by Donnie D'Amato (<a href="https://codepen.io/fauxserious">@fauxserious</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Let me explain what's going on here. In the demo above, the blue box represents the `span.floater` element dimensions. Note that because we're using `position: absolute;` for the `button` element child, it's not visually inside the `span.floater` but instead positioned relative to the surface. We set the dimensions of the `span.floater` so that the content won't collide with the dimensions of the `button` and instead wraps around it.

You can remove the `demo` attribute from the `<closable-surface/>` element to see the final result without the blue box. I'm using a custom element so that it is easy to edit the content without accidentally altering the markup meant for the buoyant button.

Try removing the title, editing the content, or resizing the window. The content should never collide with the button and always sit at the top corner.

**#make-floats-great-again**