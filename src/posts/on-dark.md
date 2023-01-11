---
title: On dark
desc: While it might seem intuitive at first, naming your tokens this way doesn't scale.
heat: 2
date: 2023-01-10
draft: true
---

The phrase "ondark" (or variations like "inverse") appear within token names in the design systems community all the time and I've tried providing recommendations in token related posts before. However, it seems this approach is becoming more wide-spread so I want to give it one final try to describe the problem with this naming scheme and how to avoid it.

## Semantic tokens or bust

The first step is fully investing in semantic tokens. I've called them "intents" in the past to further enforce the expectation that the name describes purpose over value. We're talking about token names like `button-primary-background-color` which give information about the component or pattern and the property being influenced. In no way does it give any information about what the value of this color is. The more you avoid encoding the value in the name, the more flexible your system will be with the opportunity for that color to change in the future.

This extends to any token; describe the purpose and avoid the value when naming.

## The problem

So you have a UI which is primarily light colored. Perhaps a white background with nearly black text. There's a section in this UI that you want to have a stark contrast with the rest of the page. In this section, you have some text lockup and a call-to-action button. The button has all the same properties that other buttons in the system have, except it's located on this dark background.

Most folks might have a button prepared specifically for this scenario. We might even provide a configuration for when this happens in code. `<Button appearance='ondark'/>`. Under the hood, that might reference different tokens which point to specific `ondark` values in the theme (ie., collection of semantic tokens with values assigned).

```scss
button.primary {
    background-color: var(--button-primary-background-color);

    &--ondark {
        background-color: var(--button-primary-ondark-background-color);
    }
}
```

This works fine for this section which covers the text color (by including more "ondark" colors for text) and the primary button.

Soon after, a request comes in to show a comparison table in this area; showcasing the benefits of the product of feature. In the current system, you'd need tokens to describe all of the borders of the table. Maybe you have something generic that targets borders in this area. But unfortunately you might see a problem begin to appear.

The problem is that for every UI element that _might_ appear in this section in the future, you'd need to define an entire new set of tokens to describe the color for that UI. This is especially exhausting since you've already defined tokens semanitcally for all of these things in the "default" environment. To fully cover the dark area, you'd need to **double the amount of token names** to include the additional "ondark" infix.

## Scoped themes

Instead of the dark area and the light colored page needing to be informed by a single theme, think of the dark area as an entirely separate theme. In this way, the values that represent `button-primary-background-color` can change depending on scope.

![IMAGE](#)

```css
[data-theme="light"] {
    /* You can also just make this the default and
    set on :root but I prefer to be explicit */
    --button-primary-background-color: black;
}

[data-theme="dark"] {
    --button-primary-background-color: white;
}
```

```html
<body data-theme="light">
    <button class="primary">This button has a black background</button>
    <section data-theme="dark">
        <button class="primary">This button has a white background</button>
    </section>
</body>
```

No additional configuration at the component level. No additional token names.

This still requires the design token values to be curated to account for a dark UI but you avoid the naming exercise. Now you can just name the entire collection (theme) as "dark".

## Concerns

If you worried about defining an entire new theme worth of tokens, start small. Only define the ones you need at first; text and the button. At some point you might have the resources to define it all and then you'll have an entire new theme to try.

I've considered going farther in this, specifically with surfaces that expect to demonstrate feedback (eg., warning banner). You might imagine this banner similar to the dark section above with a text lockup and action to take. I say if you have the resources to prepare this as a theme, go for it! You'll be better prepared for when code samples might appear within the notification. Otherwise, you'll need to be highly restrictive to the kinds of content that appear within various colored surfaces.

And we all know how much designers love restrictions. :)