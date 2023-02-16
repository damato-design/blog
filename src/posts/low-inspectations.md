---
title: Low inspectations
desc: Placeholder
heat: 2
date: 2023-01-30
draft: true
---

I've highlighted that design tools often don't accurately represent the medium before.

The design hand-off process is often troublesome because of intentions lost in translation. We've created expertise in this space between design and engineering to help smooth the exercise but we often try to find ways to bridge the gap without human intervention. One of these ways is generating resources to use from the design tool.

I have yet to see a _design-first_ tool that provides quality code that can be used directly into a production application.

{% aside %}
I consider Framer to be _code-first_, where assets are expected to be maintained mostly through code. Folks who are well-versed in Framer will certainly provide alternative _design-first_ approaches for the platform but this my perception of the application and I believe this outlook is shared across the design community. Honestly, I think Framer could have been a better option than Figma to provide better hand-off, but code as a first-class feature produces anxiety for traditional graphic designers who are transitioning to digital design.
{% endaside %}

I saw a great introduction Figma for developer video shared on social media this week. This is definitely a part of the role that isn't often taught, leaving most engineers stumbling around the interface. There's a lot of helpful points made in the short presentation but I need to be critical about one area in particular. The inspect panel is a trap.

Admittedly, calling it a trap is dramatic but it's also meant to warn folks who accept what the panel provides verbatim; possibly believing it's the blessed approach.

Figma, like many design tools, works on a coordinate system for its assets. Elements are added to the artboard and positioned relatively to the top-left corner. This isn't native to web layout, which works as a document and elements added are positioned relative to each other. They are situationally-aware of their ancestors and siblings and adjust their position. Could you change the positioning strategy for web elements? Yes, but you'll have a much harder time getting them to be accessible and responsive when you break out of the native document flow. Until design tools present the web using native alignment, developers will be left to intepret what a fixed coordinate system should do within document flow.

Text styles cascade down to lower elements.

## Upon careful inspection

I'm going to pull sections of code which are rendered from the instructional video and explain what to consider in each.