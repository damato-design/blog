---
title: Dynamic Storybook
desc:  I revisit a Storybook approach I used a few years ago to help visualize all my components' configurations at once. And why its not recommended in modern Storybook versions.
heat: 0
date: 2022-06-14
---

When I was exploring the next version of the design system for [Compass](https://www.compass.com/), I was really interested in how I could keep designers from recreating symbols that we already have represented in code. They'd have to painstakingly make all of the possible states and interactions for every component for the design library. I knew there was a better way so I cobbled a few systems together in order to do it.

## Legacy system

I was an early adopter of [Storybook](https://storybook.js.org/) and leveraged it to visualize the components I was building for the new design system. Writing a story was helpful to create one ideal state, or perhaps wiring it into the knobs addon allows for different configurations to happen with a few button clicks. However, what I really wanted was to generate stories based on the configuration options for each component. I was working on a very early prototype with web components so I didn't have proptypes to hook into. I opted to create an `component.props.js` file for each component to help generate configurations.

From here, I used a package called [`combos`](https://www.npmjs.com/package/combos) to create all the possible permutations of options and then create a new Storybook file to read with those new generated components. This was also used to create the files required for [`html-sketchapp`](https://www.npmjs.com/package/@brainly/html-sketchapp), which could render the HTML into [Sketch](https://www.sketch.com/) symbols.

## Component Story Format

Storybook is no longer focusing on their initial implementation of writing stories, [the `storiesOf()` function](https://github.com/storybookjs/storybook/blob/next/lib/core/docs/storiesOf.md), in favor of the [Component Story Format (CSF)](https://github.com/ComponentDriven/csf). The CSF is described as an open standard for UI component examples based on JavaScript ES6 modules. And the way to write a story seems fairly simple:

```jsx
export default { title: 'atoms/Button' };
export const text = () => <Button>Hello</Button>;
export const emoji = () => <Button>😀😎👍💯</Button>;
```

The default export is the metadata about your story; the title, the component, and maybe some additional configuration options. Each named export is a story. So in the above example, you'd have two stories. One named "Text" and one named "Emoji". And coming soon, [CSF v3](https://storybook.js.org/blog/component-story-format-3-0/) will introduce an even smaller amount of code to create a story:

```jsx
export default { component: Button };
export const text = { args: { children: 'Hello' } };
export const emoji = { args: { children: '😀😎👍💯' } };
```

However, if you know anything about the JavaScript module ecosystem you'll see the problem with my goal. **There's no way to generate stories using CSF**. In fact, Storybook doesn't even treat this file as a _real_ module at first. Storybook will actually read this file, create an [abstract syntax tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) and then begin parsing the file for information [[source]](https://github.com/storybookjs/storybook/blob/next/lib/csf-tools/src/CsfFile.ts).

Let's compare this to the original `storiesOf()` method of writing stories.

```jsx
storiesOf('atoms/Button', module)
  .add('text', () => <Button>Hello</Button>)
  .add('emoji', () => <Button>😀😎👍💯</Button>)
```

You can see that the original method of writing stories is more flexible and allows for someone to create a collection of stories and begin iterating to add to Storybook. Here's a cute one-liner to define a collection of stories.

```jsx
const stories = {
  text: () => <Button>Hello</Button>,
  emoji: () => <Button>😀😎👍💯</Button>,
};
Object.entries(stories).reduce((acc, ([name, fn])) => acc.add(name, fn), storiesOf('Button', module));
```

Interestingly, it seems that [CSF compiled to `storiesOf()`](https://medium.com/@domyen/storiesof-is-not-deprecated-598c322588c) for Storybook but I'm not sure if that's still the case.

## If it ain't broke

While Storybook no longer recommends the `storiesOf()` approach because it [conflicts with improvement plans](https://storybook.js.org/blog/storybook-on-demand-architecture/); we can still use it today. Here's how I'd begin to integrate with a React ecosystem; reading [`PropTypes`](https://www.npmjs.com/package/prop-types) to generate stories.

First, we need a way to read proptypes from a component. Luckily, there's a package for that: [`parse-prop-types`](https://www.npmjs.com/package/parse-prop-types). Here's how we might begin to use this:

```js
import parsePropTypes from 'parse-prop-types';

export default function (component) {
  const proptypes = parsePropTypes(component);
}
```

{% aside %}

If you get a collection of types that all return as `'custom'`, you'll need to include the following before defining proptypes for each component.

```js
import 'parse-prop-types';
```

For more information, like the return object structure, I recommend reading [the project's `README.md`](https://github.com/diegohaz/parse-prop-types/blob/master/README.md).

{% endaside %}

Next, we'll need to prepare a collection of properties and possible values. For `type: 'bool'` and `type: 'oneOf'`, the values are fairly straight forward. We'll put these in a lookup object for easy access.

```js
const DEFAULT_TYPE_ASSIGN = {
  'bool': () => [false, true],
  'oneOf': ({ meta }) => meta.type.value,
}
```

For the inputs like `number` or `string`, we'll need to allow custom fixtures to be included. We'll prepare an `options` argument for our function to supply this.

```js
export default function (component, options) {
  const { fixtures } = options;
  const proptypes = parsePropTypes(component);
}
```

The `fixtures` option will be an object that has each prop as a key and an array of possible values. Now we can send that into our assignments; choosing the correct fixture prior to running the function. We'll see how this works later.

```js
const DEFAULT_TYPE_ASSIGN = {
  'bool': () => [false, true],
  'oneOf': ({ meta }) => meta.type.value,
  'string': ({ fixture }) => fixture,
  'number': ({ fixture }) => fixture,
}
```

You can continue to add more as needed. I specifically omit the `func` type since it's not a visual change but you can include it if it'll help your project.

Ok, we're ready to loop through all of the proptypes.

```js

const DEFAULT_TYPE_ASSIGN = {
  'bool': (acc, { property } ) => Object.assign(acc, { [property]: [false, true] }),
  'string': (acc, { property, fixture }) => Object.assign(acc, { [property]: fixture }),
  'number': (acc, { property, fixture }) => Object.assign(acc, { [property]: fixture }),
  'oneOf': (acc, { property, meta } ) => Object.assign(acc, { [property]: meta.type.value }),
}

const isFn = (fn) => typeof fn === 'function';

const values = Object.entries(propTypes).reduce((acc, [property, meta]) => {
  const fn = DEFAULT_TYPE_ASSIGN[meta.type.name];
  return isFn(fn) ? fn(acc, { meta, property, fixture: fixtures[property] }) : acc;
}, {});
```

Notice, I've updated the functions in the lookup to have an accumulator as the first parameter; each will return the accumulator with the values for each property if it exists. Otherwise, it will return the unaltered accumulator.

Ok, now we're ready to create permutations. I'm using a more recent package for this: [`combinate`](https://www.npmjs.com/package/combinate). Let's start putting everything together.

```js
import parsePropTypes from 'parse-prop-types';
import combinate from 'combinate';

const DEFAULT_TYPE_ASSIGN = {
  'bool': (acc, { property } ) => Object.assign(acc, { [property]: [false, true] }),
  'string': (acc, { property, fixture }) => Object.assign(acc, { [property]: fixture }),
  'number': (acc, { property, fixture }) => Object.assign(acc, { [property]: fixture }),
  'oneOf': (acc, { property, meta } ) => Object.assign(acc, { [property]: meta.type.value }),
}

const isFn = (fn) => typeof fn === 'function';

export default function (component, options) {
  const { fixtures } = options || {};
  const propTypes = parsePropTypes(component);
  const values = Object.entries(propTypes).reduce((acc, [property, meta]) => {
    const fn = DEFAULT_TYPE_ASSIGN[meta.type.name];
    return isFn(fn) ? fn(acc, { meta, property, fixture: fixtures[property] }) : acc;
  }, {});

  const storyArgs = combinate(values);
}
```

The new `storyArgs` variable holds an array of objects, but we're not quite done yet. We need to have one large collection with the structure of `{ name: { ...args } }`, where the `name` is a unique identifier for each story. I opted for a simple [`slugify`](https://www.npmjs.com/package/@sindresorhus/slugify) of the `JSON` to create the identifier.

```js
import slugify from '@sindresorhus/slugify';

const storyArgs = combinate(values).reduce((acc, combo) => {
  const str = JSON.stringify(combo);
  return Object.assign(acc, { [slugify(str)]: combo });
}, {});
```

At this point you can just return the resulting `storyArgs` and pipe them into the `storiesOf()` method approach that I suggested above:

```jsx
import React from 'react';
import { default as Button } from './Button';
import { storiesOf } from '@storybook/react';
import everythingAllAtOnce from '../src'; // Your custom generator function

const fixtures = { text: ['hello', '😀😎👍💯'] };
const stories = everythingAllAtOnce(Button, { fixtures })
Object.entries(stories).reduce((acc, ([name, args])) => acc.add(name, () => <Button { ...args }/>), storiesOf('Button', module));
```

Or, if you're really fancy, you could provide more options to just have the function run the `storiesOf()` method internally.

```js
everythingAllAtOnce(Button, {
  fixtures,
  storiesOf, // Used internally to begin defining the stories produced
  callback: (args) => <Button { ...args }/>, // How each story should render with the given args
});
```

Not showing the code to implement here, you can use your imagination.
## Cool, what should we do with this?

For starters, this would a good way to begin generating assets for your component library. The [story.to.design](https://story.to.design/) tool by [‹div›RIOTS](https://divriots.com/) can transform stories into [Figma](https://www.figma.com/) components. This'll help keep the Figma library up to date with the code because it's pulling from the code. Imagine, writing minimal code to generate all of these assets!

It's also a good way to determine configurations that you may not have expected. Perhaps you notice with review of the permutations, icons in inline buttons don't work well, so you might want to set a conditional in the component to either warn or omit the icons.

Speaking of checking configurations, this would be great for testing. You could ensure a check in every configuration for some baseline metrics and even assert that all configurations that use the same props will render in the same expected way. This is truly a full coverage scenario without writing much code.

## Full circle

This brings me back to the introduction of the CSF format; which doesn't support this type of behavior at all. There's [a document](https://www.notion.so/Storybook-Combos-a5abecd87e9c4e0b86277244af093aea) outlining the possibility of "Storybook Combos", which is only a proposal with no affirmitive direction yet.

I hope that whatever the future holds for Storybook that the team sees the benefits of `storiesOf()` and attempts to support the ability for dynamic stories in the future. I'm sure the design system community has more use-cases for dynamic stories that are past just the needs outlined above.