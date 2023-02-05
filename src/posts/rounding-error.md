---
title: Rounding error
desc: Semantically rounding box corners is systematically improbable. 
heat: 3
date: 2023-02-01
draft: true
---

The tiered system of design tokens has been fairly well-established to include semantic tokens. Color, typography, and even [spacing](https://complementary.space) can be described through semantic means. This drives the question, how do we name other properties semantically to further describe a generic experience.

## Nested rounding

The [article at Cloud Four](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/) goes into the idea of nested rounding in detail. Essentially, we want the radius on rounded corners between nested elements to follow a shared center. The math is very simple:

```css
.child {
    border-radius: calc(
        var(--ancestor-element-radius) - 
        var(--distance-from-ancestor)
    );
}
```

Ultimately, we'd like to think of rounding in terms of semantics. However, because we want the rounding for one element to be derived from another, _we can avoid semantics entirely_. In practice, the reason we might use semantics is when we have decisions to make that are more complicated than just on/off. Semantics are used to describe the why we chose this value from a plethora of other possible values. In our rounding treatment, we shouldn't have more than one value. It should be a binary decision; to include rounding or not.

In other words, when curating an experience, we'd like to **simply mark elements which should receive rounding**. Later, we provide some themable amount used by the rounding calculation which affects the rounding of marked elements in a uniform manner. We do not prescribe the rounding amount explicitly, we simply expect the correct nested rounding to exist when turned on.

However, we have some problems to try and overcome.

## Deriving values

The first problem is trying to get the `--ancestor-element-radius` and `--distance-from-ancestor` values. The ancestor part provides a clue to what makes this so difficult. **The nested rounding calculation is dependent on the relationship between two elements.**

When we are preparing a layout, it's very likely that we will have several elements nested which may or may not include their own methods of supplying space. The properties of `margin`, `padding`, `gap`, and additional `position` and `transform` properties can all have a hand at visually presenting how far two elements are from each other, thereby making the `--distance-from-ancestor` value very challenging to determine.

{% aside %}
You could try computing this in JavaScript. You'd mark elements that you'd like to measure between and then write the value to a CSS Custom Property. There's a few pitfalls here; responsive changes, transforms, relative units. All of these things would make trying to capture this value a nightmare. On top of this, adding JavaScript to adjust a visual treatment seems like a bad use of the main thread.
{% endaside %}

Let assume we have a system which can readily provide the `--distance-from-ancestor`. The `--ancestor-element-radius` in a perfect system would also be derived by the formula. So where does the base radius come from that influences all other nested rounding? Would it make sense for the `<body/>` to declare the first amount of rounding? Conceptually this seems incorrect since we don't expect the `<body/>` element to have rounding at all.

Another problem with starting from the top would be that some elements would never receive rounding. If you have a button that appears in two different places, it is possible that they receive different rounding amounts based on how many nested ancestors are marked for rounding between them. This could cause the same button to look different just by its placement within the layout.

[IMAGE](#)

Instead of starting at the top, could we start at the bottom? That is, could be declare what the smallest rounding is and then have marked ancestor elements use that value? Afterall, the center of the radius that determines the rounding must exist inside this element. Perhaps a new calculation would look like this:

```css
.parent {
    border-radius: calc(
        var(--deepest-element-radius) + 
        var(--distance-from-deepest)
    );
}
```

In this way, the `--deepest-element-radius` can now be a fixed number, provided by a theme because there should be no smaller rounding applied. All rounding that occurs above this element is derived from this base amount. For the purposes of our exploration, let's call these deepest elements **rounding centers**, as they possess the center which all ancestor element rounding radii would be computed in this system.

The logic within marked ancestor elements would indentify their deepest rounding center and calculate the distance between its edges and the deepest rounding center's edges to determine the `--distance-from-ancestor`. We already know the difficulties in attempting this from above, but let's continue assuming we have a system in place which can prescribe the distance somehow.

## Existential crisis

In explaining the logic to calculate the ancestor's rounding, I simplified the approach drastically. In reality there's dozens of considerations that we'd need to account for. One of the largest problems returns back to rounding determined by an element's existence.

Imagine we have a card layout and all cards are marked to include rounding but no cards include any elements which initiate rounding; our "rounding center" elements. This would mean that none of the cards have rounded corners. When we add a button to one of the cards, rounding would exist _only on that card_. If you're thinking we could include a "virtual" rounding center, a hidden element which triggers rounding, how do we allow the ancestors to measure the distance between edges? It's possible the card's internal structure is completely different between them, making the rounding varied as well. What would be more desirable would be that all sibling cards have the same rounding, whether they have a rounding center or not.

[IMAGE](#)

We're not done with problems. If we put the rounding center element within the card, what distance should we measure? We _could_ take the shortest distance and apply to all corners. However, what happens if we position that card in the center; does the card become a circle? Ok, perhaps we can set limits on the rounding using `max()`. But then if this hits the max, outer marked elements would get the same radius.

## Level headed

At this point you might ask why we haven't just done what has been before; create levels of rounding. Since we don't need to be semantic, maybe this becomes a viable option?

Let's say we start at the base level again with a rounded button, then we have a card component which gets the next level up. What happens in we include a rounded input with a rounded button inside? We would need to insert a rounding level in between. Insertion is the biggest drawback to using a non-semantic token system. How could we possibly account for all the layout configurations which may be rounded?

[IMAGE](#)

At this point we're really more in search of a _layout_ system than just a rounding system. Prescribing layouts _could_ warrant the possibility of informing how round parts should be due to restrictions set by components of the system. We could know exactly what elements exist and the amount of space between them.