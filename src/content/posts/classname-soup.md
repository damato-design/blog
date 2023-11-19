---
title: Classname soup
desc: The problem with a superfluous utility class approach and why I choose a different path.
heat: 2
date: 2023-01-17
animal: chicken
---

The internet blew up again regarding CSS frameworks and there have been no shortage of responses. While this could just be more fuel to the fire, I hope this will be evergreen and reflect on any similar approaches that are developed over time. This also has the benefit of avoiding the name of any single framework in particular and instead comment on the direction as a whole.

## Lightbulb moment

Recently, I realized exactly why I was aversed to utility class resources after watching [Fireship.io's video](https://www.youtube.com/watch?v=lHZwlzOUOZ4) responding to the recent debates. The lightbulb lit for me specifically at this quote.

{% quote "https://www.youtube.com/watch?v=lHZwlzOUOZ4" "Fireship.io"  %}
The benefit is that you don't have all these arbitrary classnames anymore and know exactly which styles apply to it.
{% endquote %}

**#naming-is-hard** strikes again. There's two parts in the quote that I'll touch upon.

### Knowing styles exactly

**Declarative classnames are not scalable.** In a world where we lean hard into semantic tokens to help describe the experience in terms of purpose over value, we release control of the final presentation of the design to be informed by tokens way up the stack. We no longer prescribe that this card border thickness in this very specific spot must be `3px`. It should instead be applied by way of a mapping of a semantic token to a value in a theme curation exercise.

Therefore, it is not flexible to prescribe themable style via a classname. Using `.border-teal-darkest` has the same problem as having a token which is `--border-teal-darkest` applied directly to a component. [It's not semantic](../tokens-as-intents). While you could dive deep into this by adding _more_ classnames to address themes, it will become unwieldly. Additionally, I've also thoroughly described [the perils of calling something "dark"](../ondark-virus) which also has this vulnerability.

It's hard to think in this abstract way, as folks who have been building UIs to specification have been forced into "pixel-perfection" for years. While we don't use the term much anymore, the effects remain. Designers will be disappointed if they expect to have exactly this color or precisely this thickness when working within their one context when multiple exist.

### Reasoned classnames

**If it has a purpose, it should have a name.** The screenshot example in the video during the quote shows a large red 'x' over some CSS with the following classnames: `.main-navbar`, `.main-navbar-list`, `.main-navbar-list-item`. From this list I can tell exactly what component will be affected by these styles. It should only exist in one part of the project.

But what if it doesn't? That's the whole problem with naming. I could have another `.main-navbar` or worse `.btn` provided some some third-party library which then starts a style battle. I'm a lover, not a fighter!

One answer is to have a standardized method of coming up with names; similar to the semantic token scheme perhaps including a namespace to distinguish between ownership. I believe a first approach could be to have the semantic token name and the classname to be near identical, differing only in the property that the token should be assigned being encoded into the token.

```css
.ds-main-navbar {
  background-color: var(--ds-main-navbar-background);
}
```

In practice, I don't recommend being this specific but the concept is important. If you are too specific in token names, you'll wind up with thousands of tokens to describe every property of themable appearance. A better approach is to be slightly generic in the semantic token to cover several possible uses, but remain specific in the classname.

```css
/* These are specific styles for the main navigational bar component */
.ds-main-navbar {
  /* token covers the background for all navigational surfaces */
  background-color: var(--ds-surface-navigation-background);
}
```

The token can be applied to other similar surfaces but the classname identifies this specific component and the styles it needs. This can be similar to the [BEM (Block Element Modifier) structure](https://en.bem.info/) for classnames which identifies the parts of a component.

This functions well for themable properties, but what about layout? Perhaps you don't want to continue to type out all 59 characters of `grid-template-colums: repeat(auto-fit, minmax(240px, 1fr));` over and over again. I think that's a reasonable critism to have. In that case, it sound like you might have a new component on your hands.

## Component driven development

In my opinion, the best approach is _to not have classes at all_. Instead I believe we should scope the styles to uniquely to the component. This can be accomplished in some CSS frameworks or using [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM).

Using the Shadow DOM technique, you can leverage `id` instead of `class` which further demonstrates that there should only be one of these elements within the component's scope. In the Shadow DOM, the elements and styles aren't exposed to the outside DOM so duplication across different components is valid.

```html
<style>
  #main-nav {
    background-color: var(--ds-surface-navigation-background);
  }
</style>
<nav id="main-nav">
  <ul>
    <!-- Generated on mount of the Custom Element -->
  </ul>
</nav>
```

You could also avoid these attributes altogether in the Shadow DOM if the component is simple and semantic.

```html
<style>
  nav {
    background-color: var(--ds-surface-navigation-background);
  }
</style>
<nav>
  <ul>
    <!-- Generated on mount of the Custom Element -->
  </ul>
</nav>
```

In CSS-in-JS libraries, this implementation might be more concise.

```js
export const MainNav = styled.nav`
  background-color: var(--ds-surface-navigation-background);
`;
```

Not all of these components need to be exposed to users. Some of them are internal where the names won't be so critical. For example, the `.main-navbar-list` which is internal to the `.main-navbar` is not important to external users. In both of the directions shown above, you can target elements even more generically if you possess anxiety over naming.

```css
nav > * {
  /* this is the list but I don't want to name it */
}
```

However, I wouldn't recommend this since it goes against the first point that if it exists, it should have a name. Just be comforted that internal naming is much easier to iterate on.

{% aside %}
Some things might not make sense as a component and exist better as a utility. The historic [`.sr-only`](https://css-tricks.com/inclusively-hidden/) meant for hiding content visually while remaining accessible to assistive technology might be better suited using an attribute because it is not dependent on other factors for a consistent outcome and is presented imperatively. Not to mention, there's really nothing visual about it.

Though there's also nothing stopping you from creating a `<sr-only/>` web component which achieves the same result with more code.
{% endaside %}

In lieu of scoping styles, create a standardized naming strategy that keeps classnames semantic and you'll be better prepared to support a scalable experience.
