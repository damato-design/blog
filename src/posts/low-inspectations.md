---
title: Low inspectations
desc: You should be better than the inspect panel.
heat: 2
date: 2023-02-24
draft: true
---

The design hand-off process is often troublesome because of intentions lost in translation. We've created [expertise in this space between design and engineering](../terminal-career) to help smooth the exercise but we often try to find ways to bridge the gap without human intervention. One of these ways is generating resources to use from the design tool.

I saw a great [Figma for developers video](https://www.youtube.com/watch?v=hbN9RGcQFNU) [shared on social media](https://twitter.com/megaroeny/status/1625680821372739586) earlier this month. This is definitely a part of the role that isn't often taught, leaving most engineers stumbling around the interface. There's a lot of helpful points made in the short presentation but I need to be critical about one area in particular.

## The inspect panel is a trap

Admittedly, calling it a trap is dramatic but it's also meant to warn folks who accept what the panel provides verbatim; possibly believing it's the blessed approach.

### Coordinate system

Figma, like many design tools, works on a coordinate system for its assets. Elements are added to the artboard and positioned relatively to the top-left corner. This isn't native to web layout, which works as a document where elements added are positioned relative to each other. DOM elements are situationally-aware of their ancestors and siblings and adjust their position. Could you change the positioning strategy for web elements? Yes, but you'll have a much harder time getting them to be accessible and responsive when you break out of the native document flow. Until design tools present the web using native alignment, developers will be left to intepret what a fixed coordinate system should do within document flow. The auto-layout concepts gets us to begin crossing this bridge but we're not entirely on the other side yet.

💡 Ignore properties that update or declare the explicit position of an element. Consider using modern CSS techniques to place the element in the preferred location. Work with the designer to learn about the intentions between different user and device preferences.

### Hyper local font styles

Another feature of the web is that text styles cascade down to lower elements. You don't need to explicitly provide the text styles at every bit of copy. Especially if you [limit the number of fonts to improve performance](https://gtmetrix.com/blog/dont-use-too-many-web-fonts/). If you set the font styles for body copy on the `<body/>` element, you don't need to reduplicate the font definition at the element which contains the copy. Unfortunately, Figma provides text styles for every individual bit of copy in the artboard. While you can be sure that this bit of text will get the styles when you copy from the inspect panel; you could optimize for less CSS by setting the appropriate style higher in the cascade. This is also great for when you need to update the font styles globally.

💡 Set the font properties higher up (like at the `<body/>`) to allow the natural cascade to inform lower elements. Only update the property at the location where it doesn't match with the cascade.

### Missing units

Figma and other design tools that claim they are for web design do not have web units. The `rem` unit is particularly important on the web, but other units like percentage are also valuable when communicating layouts. The inspect panel is notorious for displaying verbose `width` and `height` values in pixels. [Expert CSS authors will tell you](https://youtu.be/nYyFf-97Qqg?t=118) that applying these as given in your code is bad practice. We'd rather allow the content to dictate the size of the container or base the dimensions off of some other relative proportion.

💡 Ignore `height` and `width` properties when found and let the content determine how large the container should be. Work with the designer to determine what web units would work best in areas where they are needed. Avoid using pixels units for layout properties. Using pixels for decorative elements might be appropriate (ie. `border-width`).
