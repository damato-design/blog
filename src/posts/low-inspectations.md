---
title: Low inspectations
desc: You should be better than the inspect panel.
heat: 2
date: 2023-03-01
---

The design hand-off process is often troublesome because of intentions lost in translation. We've created [expertise in this space between design and engineering](../terminal-career) to help smooth the exercise but we often try to find ways to bridge the gap without human intervention. One of these ways is generating resources to use from the design tool.

I saw a great [Figma for developers video](https://www.youtube.com/watch?v=hbN9RGcQFNU) [shared on social media](https://twitter.com/megaroeny/status/1625680821372739586) last month. This is definitely a part of the role that isn't often taught, leaving most engineers stumbling around the interface. There's a lot of helpful points made in the short presentation but I need to be critical about one area in particular; the inspect panel.

## Proceed with caution

I consider the inspect panel to be a trap. Admittedly, calling it a trap is dramatic but it's also meant to warn folks who accept what the panel provides verbatim; possibly believing it's the blessed approach. I'll be referring to [Figma's inspect panel](https://help.figma.com/hc/en-us/articles/360055203533-Use-the-Inspect-panel) in the following examples as the most popular tool to date but any design tool feature that claims to output code should be treated with skepticism.

{% aside %}
This can exclude design tools that manipulate coded assets such as [Framer](https://www.framer.com/). Because those assets are foundationally engineered, inspecting or exporting these is looking at the direct source code of the asset and not an estimated representation.
{% endaside %}

### Coordinate system

Figma, like many design tools, place assets on a coordinate system. Elements are added to the artboard and positioned relatively to the top-left corner. This isn't native to web layout, which works as a document where elements added are positioned relative to each other. DOM elements are situationally-aware of their ancestors and siblings to adjust their position. Could you change the positioning strategy for web elements? Yes, but you'll have a much harder time getting them to be accessible and responsive when you break out of the native document flow. Until design tools present the web using native alignment, developers will be left to intepret what a fixed coordinate system should do within document flow. The auto-layout concepts gets us to begin crossing this bridge but we're not entirely on the other side yet.

💡 Shy from properties that update or declare the explicit position of an element such as `position`, `top`, and `left`. Consider using modern CSS techniques like `display: flex;` to place the element in the preferred location. Work with the designer to learn about the intentions between different user and device preferences.

### Hyper local font styles

Another feature of the web is that text styles cascade down to lower elements. You don't need to explicitly provide the text styles at every bit of copy. Especially if you [limit the number of fonts to improve performance](https://gtmetrix.com/blog/dont-use-too-many-web-fonts/). If you set the font styles for body copy on the `<body/>` element, you don't need to reduplicate the font definition at the element which contains the copy. Unfortunately, Figma provides text styles for every individual bit of copy in the artboard. While you can be sure that this bit of text will get the styles when you copy from the inspect panel; you could optimize for less CSS by setting the appropriate style higher in the cascade. This is also great for when you need to update the font styles globally.

💡 Set the font properties higher up (like at the `<body/>`) to allow the natural cascade to inform lower elements. Only update the property at the location where it doesn't match with the cascade.

### Missing units

Figma and other design tools that claim they are for web design do not have web units. [The `rem` unit is particularly important on the web](../62-5), but other units like percentage are also valuable when communicating layouts. Just watch out for [magic numbers](https://css-tricks.com/magic-numbers-in-css/). The inspect panel is notorious for displaying verbose `width` and `height` values in pixels. [Expert CSS authors will tell you](https://youtu.be/nYyFf-97Qqg?t=118) that applying these as given in your code is bad practice. We'd rather allow the content to dictate the size of the container or base the dimensions off of some other relative proportion so every container is flexible to any content.

💡 Ignore `height` and `width` properties when found and let the content determine how large the container should be. Consider `max-width` or `max-height` for large composition constraints. Work with the designer to determine what web units would work best in areas where they are needed. Avoid using pixels units for layout properties. Using pixels for decorative elements might be appropriate (ie. `border-width`).

### Miscellaneous

- [`box-sizing`](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing): Hopefully this is already found higher in the cascade and [applied globally as `border-box`](https://andy-bell.co.uk/how-the-css-box-sizing-property-works/). This is what [it should have been by default](https://wiki.csswg.org/ideas/mistakes).
- [`isolation`](https://developer.mozilla.org/en-US/docs/Web/CSS/isolation): This property creates a new [stacking context](https://developer.mozilla.org/en-US/docs/Glossary/Stacking_context) and you most likely won't need to apply this property when you see it in the panel. For more information on stacking contexts and when they are helpful, I recommend [Josh W. Comeau's article](https://www.joshwcomeau.com/css/stacking-contexts/).
- [`order`](https://developer.mozilla.org/en-US/docs/Web/CSS/order): This property should be avoided. While it can change the order of elements as they are displayed visually, [the HTML won't match](https://adrianroselli.com/2015/09/source-order-matters.html). Change the layout order as HTML instead of this property.
- [`overflow`](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow): You should reserve this property to create a scrollable containers. Setting overflow past this reason will cause clipping in containers and other side-effects; such as creating a new [block-formatting context](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context). 
- [`z-index`](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index): You should try to avoid setting this property, especially in the case of considering a larger elevation system where collisions are unavoidable. For more information on why `z-index` should be considered an escape-hatch, I recommend [Josh W. Comeau's article](https://www.joshwcomeau.com/css/stacking-contexts/). Yes, I've linked it twice in one post; it's that important.

## Stop, collaborate, and listen

Ultimately, your developer should be empowered to provide feedback on the design. Likewise, the developer shouldn't depend on what the expect panel presents as perfectly appropriate. There is an expertise in translation that must occur which only comes with practice and experience. Work together towards finding the best execution of the intended design. Dare I say, even [include them in the process](https://vimeo.com/296790002). This can be the start of a beautiful partnership.