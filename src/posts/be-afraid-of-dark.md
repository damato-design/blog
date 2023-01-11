---
title: Be afraid of dark
desc: While it might seem intuitive at first, naming your tokens this way doesn't scale.
heat: 2
date: 2023-01-10
draft: true
---

The phrase "ondark" (or variations like "inverse") appear within token names in the design systems community all the time. I've tried providing recommendations in token related posts and replies before. However, it seems this approach is becoming more wide-spread so I want to give it one final try to describe the problem with this naming scheme and provide an alternative method.

## Semantic tokens or bust

The first step is fully investing in semantic tokens. [I've called them "intents"](./tokens-as-intents) in the past to further enforce the expectation that the name describes purpose over value. We're talking about token names like `button-primary-background-color` which give information about the component or pattern and the property being influenced. In no way does it give any information about what the value of this color is. The more you avoid encoding the value in the name, the more flexible your system will be with the opportunity for that color to change in the future.

This extends to any token; describe the purpose and avoid the value when naming.

## The problem

So you have a UI which is primarily light colored. Perhaps a white background with nearly black text. There's a section in this UI that you want to have a stark contrast with the rest of the page. In this section, you have some text lockup and a call-to-action button. The button has all the same properties that other buttons in the system have, except it's located on this dark background.

Most folks might have a button prepared specifically for this scenario. We might even provide a configuration for when this happens in code. `<Button appearance='ondark'/>`. Under the hood, that might reference different tokens which point to specific `ondark` values sent to the page.

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

A theme is the collection of values assigned to semantic tokens. The semantic tokens are a contract that should have permanence and meets expectations of folks building UI over time. The values that would appear as a right-hand assignment in the theme can have a separate stakeholder. For example, the brand identity is often encoded here perhaps as a separate set of non-semantic tokens (`brand-blue-500`); the color pallette influenced by the brand. In this case, the brand is responsible for curating the right-side values but the design system team is responsible for maintaining the left-side semantic token names for those values to be assigned. It is not uncommon for design system folks to be responsible for both sides though. Though I recommend avoiding managing both if possible to not introduce bias in token naming.

![Left-side super important, right-side I couldn't care less](#)

{% aside "warning "%}
While I advocate for design systems folks to be hands-off for the right-side of the theme, it's not possible to be completely ignorant of what happens there. We should be providing guidance on best practices when curating this side, especially in terms of accessibility. We should provide feedback when people choose colors that have low contrast or font-sizes that are illegible.
{% endaside %}

When the user preference is set for dark-mode, they are requesting the experience in a "dark" theme. When the marketing team wants to collaborate with a partner brand, they are expecting additional values to be included in the UI to support that partner brand.

Now for the key insight. Instead of the dark area and the light colored page needing to be informed by a single theme, **think of the dark area as an entirely separate theme**. In this way, the values that represent `button-primary-background-color` can change depending on scope.

![Visually different area is given new values to existing semantic tokens](#)

```css
[data-theme="light"] {
    /* You can also make this default and set on :root */
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

This still requires the design token values to be curated to account for a dark UI but you avoid the token naming exercise. Now you can just name the entire collection (theme) as "dark". Think of this name describing your artboard for this scope and then using that artboard in a larger project with a totally different base theme.

## Moving forward

If you worried about defining an entire new theme worth of tokens, start small. Only define the ones you need at first; text and the button. At some point you might have the resources to define it all and then you'll have an entire new theme to try.

I've considered going farther in this, specifically with surfaces that expect to demonstrate feedback (eg., warning banner). You might imagine this banner similar to the dark section above with a text lockup and action to take. I say if you have the resources to prepare this as a theme, go for it! You'll be better prepared for when code samples might appear within the notification. Otherwise, you'll need to be highly restrictive to the kinds of content that appear within various colored surfaces. And we all know how much designers love restrictions. :)

This is in contrast to [what I've recommended before](./tokens-as-intents) and I've learned from that mistake. The possibility of multiple types of buttons to appear on an colored background requires something better. This gets increasingly more cumbersome moving past text and buttons.

This recommendation also requires that the system delivering themes be flexible enough to request more than one. I think there's an opportunity for some optimization here as well; where we statically analyze the page for tokens used within scopes and only serve what's needed. However, to start you could just import the theme when a scope is added. The benefit of this is if the scoped theme hasn't been included or the scope hasn't been applied, it'll fallback to the base theme which will show all the text and buttons from the base theme.

```css
:root {
    --button-primary-background-color: black;
}
```

```html
<body>
    <button class="primary">This button has a black background</button>
    <section data-theme="dark">
        <!-- No definitions for the dark theme, 
        everything inside inherits from the light theme -->
        <button class="primary">This button has a black background</button>
    </section>
</body>
```