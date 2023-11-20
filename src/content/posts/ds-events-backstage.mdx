---
title: DS Events, Backstage
desc: Behind the scenes in the making of ds.events
heat: 0
date: 2023-09-19
animal: hyena
---

Last month I had the pleasure and honor of being invited to speak in [a webinar hosted by Knapsack about theming in complex ecosystems](https://www.youtube.com/watch?v=DPvxOcWlLn0). On that day, there were 3 different design system related events happening; two of them scheduled at the same time. It was at this point I thought that it would be helpful to have all the events in our community to be in one place. So I did what any of us do: I bought a domain.

## Helping hands

After [I announced the idea in a tweet](https://twitter.com/donniedamato/status/1696534327004364890) that day, [Josh Harwood](https://twitter.com/joshdesignnz) mentioned he had a similar idea (and also similar domain) so we ended up collaborating on the project. First jamming with ideas on LinkedIn but later using the [Design Systems Slack](https://design-systems.slack.com/) which is much better suited for this kind of work. My wife [Jen](https://twitter.com/jipdamato) was also involved in the process, making this a [Design Systems House](https://ds.house/) project.

## Concept

The idea was simple, we want some feed of events that you can view all events that have design systems content. What the registration link is, if it's online or in-person (or both) and most importantly when the event will be in relation to other events. Josh gathered a lot of different concepts to compare and identified the treatments that we liked the most. We trimmed down some of the ideas for the sake of an MVP; something that gets the general idea across.

## Design

A blank canvas is always a hard place to start. Luckily I had something for a long time ago (my second codepen) which was going to kick this off.

<iframe height="300" style="width: 100%;" scrolling="no" title="Material Design Hover Animated Calendar Icon" src="https://codepen.io/fauxserious/embed/yNrgNJ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/fauxserious/pen/yNrgNJ">
  Material Design Hover Animated Calendar Icon</a> by Donnie D'Amato (<a href="https://codepen.io/fauxserious">@fauxserious</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

I created this pen in 2015 after seeing the design of the Google Calendar icon and gave it some small animation on hover. I was super proud of it back then so I'm glad it finally found a home in a project after all these years. I thought it would be functional by flipping to the date as your scroll.

The event card design was mostly composed of the essential data we wanted to show; the who, what, where, when, and how. I recommended that the location tags were a separate treatment from other qualifiers to make them easier to identify. I felt if we had a collection of tags that were related, scanning them would be more difficult. Granted, we did also add filters so maybe this is less of a concern now.

## Development

The important thing to know about me is that I don't often build applications. I'm commonly petrified of trying to connect to a database so if I was going to pull this off, I knew I needed something simple. I've been loving [Astro](https://astro.build/) recently for it's ability to do absolute magic and since what we were making was essentially a blog where each post is an event, it seemed like a good choice. Eventually, we decided that it didn't make sense for each event to have its own page, since we weren't showing much more information between the feed and the page. Plus, the purpose for folks visiting isn't to stay on this site, but to go register at another.

### Dates

Inevitably, this kind of a site will require a heavy use of datetime manipulation. Unlike many developers, the `Date()` object doesn't scare me; I've been working with it for years and understand what it's doing most often. Here's some of the finer points of the system in this regard.

- Writing a UTC date into the client is trivial when the timezone is included. It'll be localized when finally rendered as a string.
- Speaking of rendering as a localized string, you always want to reach for [`Intl.DateTimeFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) and its related methods. It even has the ability to give you [the parts of a localized date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts). We use this for the mini calendar pages.
- The harder part is having the client enter a datetime and sending it as UTC. The form that creates an event uses a `<input type="datetime-local"/>` which should give some indication of what it does. However, this was the easiest way to put a datetime input on the page.

### Timezones

A helpful fact about working with Josh is that he lives in New Zealand, on the complete opposite side of the world from me in New York. For him, it is all too common for him to need to translate dates and times into his local time just to see if they are remotely available to participate. The process of converting to local time is annoying and we wanted to change that. This is where the global timezone input was born and it was a bit of a challenge.

The list of timezones is very simple, as is getting the user's current timezone. One line of code each:

```js
const timezones = Intl.supportedValuesOf('timeZone');
const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
```

The hard part is getting the UTC offset from the timezone name. For that, I had to do [some digging](https://stackoverflow.com/a/64262840) but here's the final result:

```js
function getUtcOffset(timeZone) {
    const timeZoneName = Intl.DateTimeFormat("ia", {
        timeZoneName: "shortOffset",
        timeZone,
    })
        .formatToParts()
        .find((i) => i.type === "timeZoneName").value;
    const matchData = timeZoneName.match(/([+-])(\d+)(?::(\d+))?/);
    if (!matchData) return '';
    const [, sign, hour, minute] = matchData;
    return [sign, (hour || '0').padStart(2, '0'), (minute || '0').padStart(2, '0')].join('');
}
```

- Using the timezone name, format it's parts using `'ia'` ([Interlingua](https://en.wikipedia.org/wiki/Interlingua)) to return the `timeZoneName` value.
- That value should include the UTC offset with some parts that we parse out with a Regular Expression.
- We deconstruct the Regular Expression result and reconcatenate with padded digits.

Using that function, with the value from a `<input type="datetime-local">`, I can create a UTC time in the client with a bit more concatenation.

```js
function onChange({ target }) {
    const isoUtcDate = new Date(`${target.value}:00${getUtcOffset(timeZone)}`).toISOString();
}
```

There might be a cleaner way to do this if I was to dive into source of [`date-fns`](https://date-fns.org/) or [`moment`](https://momentjs.com/). Something to look into for later.

Now the global timezone input will change all of the dates and times to the user's selected timezone. This is very helpful when inputting a new event; so you don't need to lookup what it is for your timezone. You can enter the information in the timezone announced by the event.

One of the fast-follows we'll need to do is including the timezone for physical events. Since seeing the local datetime when the event is posted in another timezone is confusing. This should be just saving the user's timezone when the data is input for physical events, assuming they aren't trying to convert themselves. For the moment, the time at each event links to the global timezone input so a person can update it themselves but it would probably be helpful to display this on the physical events upfront. It's also not immediately clear which timezone a physical event might be in for all visitors. 

### Images

What is a post without an image? We knew we wanted to give each event some more personality than just the event details. So including an image was important. My idea was to have a few options; image upload or image "search". The image upload is easy using `<input type="file"/>` with a little bit of CSS magic to make it look consistent with other inputs. However, the image search was much more involved.

The idea was for the user to input a URL and we'd intelligently get an image based on the URL. Here's the steps:

- If the URL is an image, use it.
- If the URL is an HTML page, check for an Open Graph image and use that.
- If the URL is an HTML page and doesn't have an Open Graph image, take a screenshot.

From my experience, whenever I hear screenshot, I immediately think I need a headless chrome browser to render the HTML. I initially started using [Playwright](https://playwright.dev/) and got everything working in development on my local machine. However, as soon as I uploaded the build to Netlify, it failed. Why? Playwright is too large. I tried looking at tutorials for folks successfully using it or [Puppeteer](https://pptr.dev/) in a Netlify function but nothing I tried worked.

I was pretty defeated after several hours of work trying to figure out how to make this smaller. At the end of it all, I came to my wife with a big hug and all she said was "is there anything else you could do?" That's when it hit me; maybe I don't need headless chrome at all?

For two of the 3 options, all I'm really doing is a `fetch()` request and I don't need any dependencies for that. That left the last option, the screenshot. I searched for a few hours, trying different packages and looking at their sizes. I finally found one that worked; [`red-snapper`](https://www.npmjs.com/package/red-snapper). I don't know how, but this package is only 160kB (gzip) and makes screenshots pretty easily. The one gotcha is that you'll want to add the `delay` option so the page has a chance to load.

One small addition for this was including an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) to the fetch as it's possible a URL might not be valid so instead of the normal timeout, we abort ourselves.

```js
async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 8000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
  
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
  
    return response;
}
```

### Verifying

So if a person makes a new event, how do we review it? I knew I wanted to avoid creating some [RBAC](https://en.wikipedia.org/wiki/Role-based_access_control) system all for the sake of 3 of us looking at some data once in a while. I had the idea of using Github PRs for reviewing the submissions. However, when I started looking at the [official docs](https://octokit.github.io/rest.js/), I was immediately overwhelmed. There's just so much you need to know to get things working. That's when I caved; I asked [ChatGPT](https://chat.openai.com/) to just tell me how to do it.

As much as I believe that technology will eventually help up do things more efficiently, I will rarely use it personally. There's something about having the ability to do it myself that makes me feel useful. The Github docs on the other hand make me feel completely inadequate. I think the other reason why I think this was appropriate is because this isn't really my area of expertise. My world is the front of the frontend so that's where I want to comfortably keep my expertise.

Back on track and a few `await` calls later, I can create a PR for the repository with a new event submission. Now we can just login using Github, make approvals and merge with an auto-deploy. It even has branch previews courtesy of Netlify!

Eventually, we'll make the form more intelligent. The error messaging isn't great and we'd like to have a predetermined list of locations to choose before creating a new one. However, as long as there is a good attempt at completing it, it'll submit. Plus, someone from the team can always correct an entry before it's posted.

### Reviewing the past

One of the things we discussed about was what happens when events are complete? Do we not show them, or maybe show them differently? Do we have the ability to link to resources produced by the event? I had strong feelings about the last point. It was important to me that we review an event once. Otherwise it would be exhausting trying to collect all the information from past events on a regular basis. Additionally, if we were going to put the responsibility on the person who submitted the event in the first place; I'd need some way of reidentifying who they were to update the post. That returns back to the RBAC problem; now with user creation. I squashed the idea just because of my abilities but I do see the benefit in a more complete system.

As for the other features of past events. We opted to do a pagination approach, where the first event at the top of the feed in the homepage is the next upcoming event and following events go forwards in time. If you go back one page, the first event at the top will be the most recent _past_ event and subsequent events go further back in time. Historical events are stylized in a sepia filter (including the pagination button when you will travel to a historical page) to make them look more old-timey.

### Pagination

Speaking of pagination, this was trickier than I expected since we aren't starting at the first or last event, but something in the middle. When you load the page, we determine what today's date is and then mark the next event according to that date. Then we separate pages offset by that date. I had a few tries trying to get this to work and had plenty of fumbles. Not because of the date comparisons, since the `Date()` object value is a number, but juggling what to show on which page.

Eventually, I figured to just segregate the events as if they were paged each time you filter and/or paginate but I wasn't quite sure what that algorithm looked like. Here's what my thought process was.

- Get today's date, find the next event in the list and get it's `index`.
- Chunk the events (into pages) so that the `index` is the _first_ in its chunk.
- Find the chunk that has the `index` and return that chunk.
- If paginating, return the chunk offset by the target chunk and given page.

I was feeling a bit confused here too, so I tried giving some prompts to ChatGPT here too. However, it was not given me the right results and I knew why. It would find the next event and just _move_ it to the first of some chunk. What I wanted was for the the first chunk to be adjusted so that the target event would wind up as the first. After seeing the general approach, I realized I just needed the handy `%` operator. Here's the final function:

```js
chunk(arr = [], size, target) {
    const chunks = [];
    let currentChunk = [];
    let chunkSize = arr.indexOf(target) % size || size;

    if (arr.length < chunkSize) {
        return [arr];
    }

    for (const item of arr) {
        currentChunk.push(item);

        if (currentChunk.length === chunkSize) {
            chunks.push(currentChunk);
            currentChunk = [];
            chunkSize = size;
        }
    }

    if (!chunks.includes(currentChunk)) {
        chunks.push(currentChunk);
    }

    return chunks;
}
```

So if I had an array with the numbers 1 through 15, and wanted the size to be `5` but the target as `8`, the resulting array would look like this:

```js
[[1, 2], [3, 4, 5, 6, 7], [8, 9, 10, 11, 12], [13, 14, 15]]
```

Notice how the `8` is at the first position in its chunk.

### Web Components in Astro

I love web components and I've been using them for years. Astro supports web components but it's not well documented. I had a lot of learnings trying to use them in this project and here's some takeaways that will be helpful.

- You don't need to use the ShadowDOM, Astro will encapsulate styles within the framework.
- You can create a one-page `.astro` component as a web component, and import into other places across the project.
- Spread `Astro.props` on the component and `<slot/>` is your friend.

```html
<my-component { ...Astro.props }>
    <slot><!-- default content can go here --></slot>
</my-component>

<style>
/* Encapsulated styles are here, no ShadowDOM required */
</style>

<script>
    class MyComponent extends HTMLElement {
        constructor() {
            super();
            /* Do whatever you need here */
        }
    }

    customElements.define('my-component', MyComponent);
</script>
```

And then in another `.astro` file  (assuming you have a `@components` alias):

```html
---
import MyComponent from '@components/MyComponent.astro';
---

<MyComponent id="my-component">
    <span>Stuff for the slot</span>
</MyComponent>
```

I did a mix of this kind of web component and ShadowDOM ones. You can identify the older components from the newer ones because of this.

### Global events

I also needed the components to talk to each other. Normally I'd select them from the DOM to begin listening but. I got lazy and just sent most of the events over the `document`, so many of the components have a `customEvent` method that sends a `detail` key in the event with the data it has processed for another component to pick up and use for something. One of the longest chains in the system goes like this:

- On timezone change, get the full event list.
- On full event list request, filter the events.
- On filter complete, paginate the results.
- On pagination complete, render the results.

It's possible that other events will trigger the flow. For example, you can trigger the filters without requiring a timezone request, which also sends a message to reset pagination (since filtering will re-adjust the results on pages).

### Filtering

And speaking of filtering, this was a bit tricky as well. The direction I chose was that if a filter was checked, it should be shown. So if nothing is checked, then nothing is shown. Then we check all the filters by default so the visitor sees everything by default and they can remove as needed. The data behind it looks like it might work the same, but it doesn't. Specifically the "Free and Premium" filter which reads from a single data point `free`.

- If both are checked I need to show both `free: true` and `free: false` events.
- If one is unchecked, I need to hide what the checkbox represents.
- If both are unchecked, I need to hide both.

Meanwhile, the "In-person and Remote" filter works much easier:

- If In-person is unchecked, hide in-person events.
- If Remote is unchecked, hide online events.

We considered having filters for location but that would require an API key to some geolocation service which would have cost some more money. We hope to collect some locations in the coming months to use for filtering as a next step.

### Release ready

A site needs all the finishing touches. Jen made the site's Open Graph and Twitter images. She also chose the colors for the site since I'm color deficient. Josh recommended an `.ics` file to be created for subscriptions, so people can just add our calendar to see the events as they are added. Josh also put together the list of events that were upcoming as they were announced so we could add to the site when we were ready. There's a lot more ideas that were at play but not enough time to implement. [We'll collect more feedback](https://forms.gle/jLxTi7ENnqrY2a7C9) and have time to revisit later this year.

We're excited to finally show off this past month's worth of afterhours work to bring our community closer together. [Visit the site](https://ds.events) and subscribe to a feed. If you know of a design systems event coming, help our community by adding it.