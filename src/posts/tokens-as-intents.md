---
title: Tokens as intents
desc:  Design tokens are ubiquitous in design systems and allow for individual values to be reused with a single name. What should that naming system be?
emoji: 💰
date: 2022-05-12
---

There are tons of definitions of design tokens on the web. Enough that I won't link to them here and you can find your favorite one with a web search. Many of the examples of design tokens show a relationship that looks something like this:

- `color-blue-500` ⬅ `#0000ff`

Here, there's a name that represents the value. The naming in this example indicates a few things like the category (color) then a family within the category (blue) and finally a way of showing a relation between similar tokens of the same depth (500). This was well advertised through the [material design color palettes](https://material.io/design/color/the-color-system.html).

## The immediate problem

Now let's say we design a button, and we want to give it an accent color from our palette. Maybe this is also our brand color and used for a few other marketing items as well.

```css
.btn {
  background-color: var(--color-blue-500);
  color: var(--color-white);
}
```

Seems harmless. That is until you get a message from marketing and the brand colors are changing. What do you do? You might think a quick fix would be to do this:


- `color-blue-500` ⬅ `orange`

Because `color-blue-500` is the brand color, it'll update in all of the spots. Clearly this isn't a good approach because the name no longer matches the value.

Instead you'd have to update all of the places where the brand color was used.

```css
.btn {
  background-color: var(--color-orange-500);
  color: var(--color-white);
}
```

Oh wait, is that white accessible on the orange? That might need to be updated too!

```css
.btn {
  background-color: var(--color-orange-500);
  color: var(--color-black);
}
```

As you can see, you'd be combing through existing assets; looking for areas that need to be updated and never being sure you've gotten everything. We need a better system and you can probably give a recommendation already. Let's change the mapping to the following:

- `color-primary` ⬅ `orange`

Now, I can use that name without worrying about the value.

```css
.btn {
  background-color: var(--color-primary);
}
```

It doesn't yet solve the relational colors (ie., the text color) but we'll get there.

## Provide intention

The concept that I'm describing is not new. It is a token naming approach that attempts to loosen the description of the value by providing more meaning. [Nathan Curtis](https://twitter.com/nathanacurtis) [lands on this idea](https://medium.com/eightshapes-llc/naming-tokens-in-design-systems-9e86c7444676) through an exploration of other systems' naming conventions without explicitly calling them more than design tokens.

What Nathan calls _concepts_ in his post is the basis behind the naming convention that I've been calling _intents_ since 2017 which is a term coined by [Joe Schmitt](https://twitter.com/josephschmitt). The idea is that **the token name should describe an intention, not the value**.

As a designer, I want to place a button inside of a card. What kind of button should go into that card? I don't mean what color or font size, I mean _what kind of button_. When we design an interface we are making decisions about the kind of thing to use that is expected to help the user move forward. We decide to use a primary button because we want to draw the user's attention here first before any other action. The kind of button is primary due to its priority and the decision I'm making is an **intent**. We can separate the intent from the styles we associate with that intent.

Another example would be an alert banner. Which banner should I use to show your credit card is about to expire? I'm not looking for the orange banner, I'm looking for the warning banner. I intend to describe to the user that this message is a warning. If you think in this way, the style of the warning is not important. It's the decision about how we expect to convey this message that is important.

If you fully adopt this approach, this helps by teaching the user similarly styled things have the same behavior. It'll be easy for a user to identify all primary actions or warning statuses because they have the same treatment (or have the same intent) across uses.

To be clear **intents are tokens**. They just have a special purpose in the ecosystem.

## A new system of naming

If we use the intent based naming system, the mapping might look have an assignment like these:

- `feedback-warning-surface-color` ⬅ `color-orange-500`
- `feedback-warning-onsurface-color` ⬅ `#fff`

Notice that the right-hand side can be a raw value or some other variable. It might help for these to be reusable variables like `color-orange-500` because you might reuse this value is other places. What matters is that the intent name (the left-hand side) does not change.

Those intent names are describing parts of the experience where we intend to show a warning by using a background color and a foreground color. When you set an intent as a component property value, this is effectively a marriage. It should never change.

Now we can use the `feedback-warning-surface-color` in places of the experience where we intend to show a warning. These areas will not change their intent! We will always show a warning here, even if we style it differently later.

```css
.alert-warning {
  background-color: var(--feedback-warning-surface-color);
  color: var(--feedback-warning-onsurface-color);
}
```

With this system, you are able to support any variation of theming; light & dark mode, brand changes, private labeling, etc.. All you need to do is store different mappings of values to intents (aka. _theme_). Maybe in one theme, warnings need to be shown in red. In that theme change the mapping for warning backgrounds to red.

- `feedback-warning-surface-color` ⬅ `color-red-300`

You'll never need to go into the components to make a change as long as we use intents to describe the styles. Just make a new theme and give the experience a new look.

## Recommendations

I've have a few years of experience with this approach and want to document some of the pitfalls to avoid when implementing.

**Avoid the words light and dark**. You might consider trying this for buttons that appear on inverted backgrounds. Instead, I recommend setting an inverted theme within that container so it can cover all of the possible treatments within. Remember, it's probably not just the button that needs to be inverted, there's probably text or input fields that might need coverage too. If you really need to show a relationship use the word "contrast" instead.

**Make naming relative to the page styles**. I recommend a very generic category called "box" which in its simplest form describes the `<body/>` styles.

- `box-background-color`: The `<body/>` background color.
- `box-foreground-color`: The `<body/>` text / icon color related to the background.
- `box-border-color`: The most common border color for boxes which will share the `<body/>` background color.

In my experience there might be another kind of container that is meant to show a visual difference from the body background. I tend to name this `boxLowContrast` because it is still relational to the `<body/>`. If you have more variations that this, you'll have to get creative with your naming here. Remember, this is for generic non-interactive containers. You can have additional categories for more meaningful containers.

Doing this allows you to keep in the mindset of a theme when completing the mapping.

```json
// "light theme"
{
  "box-background-color": "#fff", // white
  "box-foreground-color": "#000", // black
}
```

```json
// "dark theme"
{
  "box-background-color": "#000", // black
  "box-foreground-color": "#fff", // white
}
```

**Start with generic categories**. A component is not necessarily an intent. You can consider a tab to be a part of an actionable category. Perhaps dive a step deeper into a navigational category. However, I would not recommend making a "tab" category.

- `action-background-color`: Generic, describes all interactive element backgrounds.
- `navigation-background-color`: More specific, describes all interactive element backgrounds which are meant for navigation.
- `tab-background-color`: Very specific, only describes the tab background color.

Here are some categories that have worked well in the past:

- **box**: Describes generic non-interactive containers, eg. `<body/>`.
- **action**: Describes interactive containers, eg. `<button/>`.
- **navigation**: Describes interactive containers for the purpose of navigation, eg. `<a/>` (link).
- **control**: Describes interactive containers for the purpose of inputting information, eg. `<input/>`.
- **feedback**: Describes non-interactive containers for the purpose of indicating a system state to the user, eg. banners, badges, notifications.
- **figure**: Describes the use of color meant to segregate entities, eg. data-visualizations, illustrations, default avatar colors.
- **text**: Describes all use of typography, more on this later.

The feedback and figure colors are unlike the others. For the feedback category I recommend the following set of properties.

- `feedback-[type]-surface-color`: Describes when the background is used to indicate the status through color. This is meant for banners that use the background as the color accent.
- `feedback-[type]-onsurface-color`: Describes the color to use for elements that appear on the `feedback-[type]-surface-color` such as text and icons.
- `feedback-[type]-foreground-color`: Describes when the text is used to indicate the status through color. An example of this might be error text underneath an input field. This color is related to the `box-background-color` in terms of contrast and application.

A caveat here is that if you attempt to put more complicated experiences within a container which has `feedback-[type]-surface-color`, the related `feedback-[type]-onsurface-color` will have difficulty applying coverage to the elements within. The recommendation here is to keep the feedback to text and icons only.

The figure category is the least well understood. The best way to curate this is to order the colors by expected popularity within coloring illustrations. This is also a good area to consider having more specific categories if necessary. For example, if the colors used for illustrations are different from those being used within data-visualizations. Otherwise I just number these to indicate popularity.

- `figure-color-1`: The most used color within illustrations (other than box colors).
- `figure-color-2`: The next most used color within illustrations.
- `figure-color-3`: ...and so on.

I've avoided trying to describe intents for the purposes of marketing because decisions of color there are often based on associated with given photography. In these areas you might opt to actual hard code the color because of the close association with the surrounding material and not necessarily with the overall page. Another recommendation might be to just have the following intents to only be used in places where the brand should be highlighted and not for areas with better intents.

- `feedback-brand-surface-color`
- `feedback-brand-onsurface-color`
- `feedback-brand-foreground-color`

**Create additional variations to each category** as necessary or potentially extend variations to others. For example we can imagine that all interactive categories will require a "hover" variation. Which would mean the following intents may exist:

- `actionHovered-foreground-color`
- `navigationHovered-foreground-color`
- `controlHovered-foreground-color`

Remember to cover all of the possible states that your interaction might have.

{% aside %}

I've chosen to use the past tense to describe these states to indicate what has happened. You can think about this with the word "selected" where we wouldn't use the word "select" to describe the state. You can also think of the word you might use if combined with "is" (ie., is hovered, is focused).

{% endaside %}

One more note, if you are using focus rings, I recommend associating the ring with the _box_ category because the ring visually appears on the box, not on the interactive element. As you might expect, having the same focus treatment across all interactive elements will be best and having it associated with the box category makes this easy to maintain. This would also go for shadows, although shadows have much more to do with light cast rather than a theme and could be avoided altogether.

## Typography

I've mentioned in the recommendation that there should be an entire intent category dedicated to text. This is meant to have the same approach where each kind of text is identified based on purpose. Here are the variations that seem to work best.

- **Heading**: Meant for large titles.
- **Title**: Meant for small titles.
- **Action**: Meant for text within interactive elements.
- **Input**: Meant for text within text fields.
- **Caption**: Meant for text providing additional detail, like help & error messages.

This isn't including the default category. So you'd see the following in a theme:

```json
// default theme
{
  "text-font-weight": 400, // body font weight
  "textHeading-font-weight": 700,
  "textTitle-font-weight": 600,
  ...
}
```

Clearly, this method doesn't support different levels of content hierarchy with just this collection of tokens alone. To do that you could either base the type scale on density (as is done here in the [damato.design](https://damato.design) family of sites.) or use the given font size as a base to compute additional font sizes using a set scale. That's an explanation for another post.

## And beyond

From here you can include additional properties to each category or even add categories as your organization needs. Here within the [damato.design system](https://system.damato.design) we have identified `border-size`, `border-curve`, and `density-size` as additions to the box category to describe those features.