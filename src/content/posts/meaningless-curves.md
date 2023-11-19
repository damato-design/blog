---
title: Meaningless curves ahead
desc: Semantic nested rounding is systematically inconceivable. 
heat: 3
date: 2023-02-07
animal: hippo
---

The tiered system of design tokens has been fairly well-established to include [semantic tokens](../tokens-as-intents). Color, typography, and even [spacing](https://complementary.space) can be described through semantic means. This drives the question, how do we name other properties semantically to further describe a generic experience?

## Nested rounding

[This article at Cloud Four](https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/) goes into the idea of nested rounding in detail. Essentially, we want the radius on rounded corners between nested elements to follow a shared focus (ie., center of a circle). The math is very simple, here it is using CSS notation:

```css
.child {
    border-radius: calc(
        var(--ancestor-element-radius) - 
        var(--distance-from-ancestor)
    );
}
```

Ultimately, we'd like to think of rounding in terms of semantics. However, because we want the rounding to be derived from elements, _we can avoid semantics entirely_. In practice, the reason we might use semantics is when we have decisions to make that are more complicated than just on/off. Semantics are used to describe the why we chose this value from a plethora of other possible values. In our rounding treatment, we shouldn't have more than one value. It should be a binary decision to include rounding or not and let other factors determine how round to achieve the nesting effect.

In other words, when curating an experience, we'd like to **simply mark elements which should receive nested rounding**. Later, we provide some themable amount used by the rounding calculation which affects the rounding of marked elements in a uniform manner. We do not prescribe the rounding amount at any one element explicitly, we simply expect the appropriate nested rounding to exist when turned on.

However, we have some problems to try and overcome.

## Deriving values

The first problem is trying to get the `--ancestor-element-radius` and `--distance-from-ancestor` values for the formula. The ancestor part provides a clue to what makes this so difficult. **The nested rounding calculation is dependent on the relationship between _two_ elements.** This is different from a [semantic spacing approach](../spacing-solved) as we only select a spacing token to convey a relationship. In the rounding formula, the final value is computed _using the resulting relationship_ when the rounding is meant to be applied.

When trying to fill the `--distance-from-ancestor` value, it's very likely that we will have several elements nested which may or may not include their own methods of supplying space. The properties of `margin`, `padding`, `gap`, and additional `position` and `transform` properties can all have a hand at visually presenting how far two elements are from each other, thereby making the `--distance-from-ancestor` value very challenging to determine.

{% aside %}
You could try computing this in JavaScript. You'd mark elements that you'd like to measure between and then write the value to a CSS Custom Property. There's a few pitfalls here; responsive changes, transforms, relative units, etc.. All of these things would make trying to capture this value a nightmare. This isn't a simple programmatic redlining exercise. On top of this, adding JavaScript to adjust a visual treatment seems like a bad use of the main thread. [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for `border-radius`? Now that's just crazy talk.
{% endaside %}

Let's assume we have a system which can readily provide the `--distance-from-ancestor`. The `--ancestor-element-radius` in a perfect system would also be derived by the formula. So where does the base radius come from that influences all other nested rounding? Would it make sense for the `<body/>` to declare the first amount of rounding? Conceptually this seems incorrect since we don't expect the `<body/>` element to have rounding at all. Though, we can simply choose not to apply rounding at the `<body/>` and rather only define the value here.

Another problem with starting from the top would be that some elements would never receive rounding. If you have a button which expects rounding to appear in two different places, it is possible that they receive different rounding amounts based on how many nested ancestors are marked for rounding between them. This could cause the same button to look different just by its placement within the layout.

![Content without rounding prescribes non-rounded button, content with rounding prescribes rounded button.](/images/rounding-top-down.png)

So, instead of starting at the top, could we start at the bottom? That is, could we declare what the smallest rounding is and then have marked ancestor elements use that value? After all, the center of the radius that determines the rounding must exist inside this element. Perhaps a new calculation would look like this:

```css
.parent {
    border-radius: calc(
        var(--deepest-element-radius) + 
        var(--distance-from-deepest)
    );
}
```

In this way, the `--deepest-element-radius` can now be a fixed number, provided by a theme because there should be no smaller rounding applied. All rounding that occurs above this element is derived from this base amount. For the purposes of our exploration, let's call these deepest elements the **rounding focus**, as they possess the center which all ancestor element rounding radii would be computed in this system.

The logic within marked ancestor elements would identify their deepest rounding focus and calculate the distance between their bounding boxes to determine the `--distance-from-ancestor`. We already know the difficulties in attempting this from above, but let's continue assuming we have a system in place which can prescribe the distance somehow.

## Existential crisis

In explaining the logic to calculate the ancestor's rounding, I simplified the approach dramatically. In reality there's dozens of considerations that we'd need to account for. One of the largest problems returns back to rounding determined by an element's existence.

Imagine we have a card layout and all cards are marked to include rounding but no cards include any elements which initiate rounding; our "rounding focus" elements. This would mean that none of the cards have rounded corners. When we add our rounded button to one of the cards, rounding would exist _only on that card_.

![Button with rounding only influences one sibling, others are not rounded.](/images/rounding-bottom-up.png)

If you're thinking we could include a "virtual" rounding focus, a hidden element which triggers rounding, how do we allow the ancestors to measure the distance between edges? It's possible the cards' internal structures are completely different between them, making the rounding varied as well. What would be more desirable is for all sibling cards have the same rounding, whether they have a rounding focus or not. Except we've already determined that nested rounding is only determined between an element and ancestor, not from siblings. Do we then have further markings for rounded siblings to share values? Which sibling rounding takes priority?

We're not done with problems. If we put the rounding focus element within the card, what distance should we measure? We _could_ take the shortest distance and apply to all corners. However, what happens if we position that button in the center of the card; does the card become a circle because the button is positioned so far from the edges? Ok, perhaps we can set limits on the rounding using `max()`. But then if this hits the max, outer marked elements would get the same max radius thereby breaking the nesting effect.

## Level headed

At this point you might ask why we haven't done what has been before; create levels of rounding. Since we don't need to be semantic, maybe this becomes a viable option?

Let's say we start at the base level again with a rounded button, then we have a card component which gets the next level up. What happens when we include a rounded input with a rounded button inside? We would need to insert a rounding level in between. The loom of insertion is the biggest drawback using levels. How could we possibly account for all the layout nesting configurations which may be rounded to avoid levels being added or orphaned?

At this point we're really more in search of a _layout_ system than just a rounding system. Prescribing layouts _could_ warrant the possibility of informing how round parts should be due to restrictions set by components of the system. We could know exactly what elements exist and the amount of space between them. Creating a robust layout system is outside the scope of this exploration since that would attempt to define all possible layouts for any hypothetical experience; a monumental task.

So for the moment, I don't believe there's any possibility of a semantic nested rounding system due to the natural dependencies on existing elements. We're unfortunately stuck with a more meaningless system which can provide few nesting effects for curated components.

But maybe that's the point. Other properties are decided in an experience based on qualities like feedback, hierarchy, and relationship:

- The color orange often indicates a warning.
- Large text can support a section outline heading.
- Less space between items means they are related.

[If this isn't branding](https://twitter.com/FonsMans/status/1620022363722240000), what information does corner rounding convey past being round? [Goose egg](https://en.wiktionary.org/wiki/goose_egg) 🥚.