---
title: Colors don't solve problems
desc: I argue that we spend too much time curating color in design systems and as a result we lose focus against much more important priorities.
emoji: 🎨
date: 2022-07-11
---

First and foremost, I'm color deficient. You might have heard of this as color-blindness however, I am not blind to color. I do not see the world in only black-and-white. I can see colors, just not as well compared to most people. I can appreciate a good synthwave hot pink most of the time. In college, I told one of my art professors that I was color deficient and I'll never forget what he said:

{% quote "#" "Art professor" %}
Maybe you should consider a different major.
{% endquote %}

Luckily, I didn't wind up working in art. I work in design.

## Art is not design

Art is a freedom of an artist's expression; an attempt to convey a feeling through their medium. It is commonly an egocentric activity to achieve a desired appearance. This is in contrast to design, specifically product design, which is striving for altruism and inclusivity. This is supported through pattern recognition and reusing familiar experiences to achieve a goal. Design systems are the ultimate solution for achieving this cohesive experience; establishing trust between the user and the product. One deviation from past experience could be enough for the user to hesitate on the next step or stop the progress indefinitely.

In design, form follows function. It means that something should be usable before it is beautiful. In order to do this, we must identify the problem we need to solve. In a qualified user experience practice, this will not begin with designing an interface but with research. Interviews, competitive analysis, user personas, and all the truth finding techniques to paint the best picture of the problem so that you can begin to hypothesize a solution.

## Wirecutting

After completing a phase of user research, the next task is not jumping into high-fidelity, pixel-perfect mockups. I'll coin the term "wirecutting" for when a designer cuts out this wireframing step. Wireframing helps visualize the flow and features expected to support the user's goals. In this process, it is easy to see when cluttered interfaces appear and the priority of elements reevalutated. These are commonly without color and for good reason. Color is a distracting exercise here past notation to provide more clarity. Though it could be argued that an elegant experience would not need further explanation than the given wireframes and avoid color even for this exercise. Striving for simpilicity will result in a future of thankful users starting at the wireframe stage.

I believe in a world where wireframes are piped into a tool which creates high-fidelity mockups using the rules and guidance of a design system. Amazingly, this world is here in the form of [Uizard](https://uizard.io/). Using this tool, designers can avoid the nuiances of following the system guidelines and focus on the experience by wireframing. The tool will then use an existing design system to inform what a high-fidelity mockup would look like.

Of course this assumes a design system is in place. So let's now focus specifically in this area.

## Putting the color before the horse

There's dozens of posts online about how color palettes were created for a design system. A great deal of talk about color theory and creating tools to help visualize curves of color for the perfect balance. I cannot deny that resulting palettes are often very beautiful. Here's the question, how much of that palette do you really expect to use?

Let's first just talk about contrast which is a requirement to make something accessible. If you have several steps of color, I'd guess that many of the colors found within the middle of those steps have trouble being accessible with _most_ colors in your palette. It's very possible you could omit much of the palette to avoid accessibility problems. The reason why you want to omit color is to reduce cognitive load for your peers. In other words, trying to choose the right color becomes a challenge when there are so many to choose from. Limiting the selection drives consistency because there isn't much to choose from.

Past contrast, let's now talk about the application of color within an interface. If you look at many modern interface designs today, they tend to follow a 60/30/10 rule. This comes from interior design where you choose 3 colors and use them in percentages in your space. This is a loose rule, and [opponents of the rule](https://bootcamp.uxdesign.cc/problems-with-the-60-30-10-rule-25206d02bbfd) will call out several factors against it. 

{% quote "https://bootcamp.uxdesign.cc/problems-with-the-60-30-10-rule-25206d02bbfd" "Catherine Rasgaitis" %}
First, restricting a color palette to only three colors inhibits creative designs. While it prevents overstimulation, exploring more “rebellious” designs make brands stand out from their competitors. Breaking rules or making new ones is how trends start.
{% endquote %}

For the purpose of functional product design, I don't believe we should be striving for creativity in the application of color. Users are expecting familiar and accessible experiences. Painting with all of the colors of the wind will feel like navigating a hurricane. The limiting of this color helps set expectations as users achieve their goals.

Even in interior design, the original onset of the rule, it is near impossible to strictly use those three colors. There will be additional hints of other colors from the chosen selection of elements that make up a room. Admittedly, the rule should probably be something like 60/25/10, which leaves an additional 5% of various colors not covered by the rule where applicable. The point is that the majority of color will cover the background, the next most important color covers content, and the final most important covers accents that draw the user toward interactivity.

## Status and regions

An area where more colors are typically introduced are parts of an experience that are meant to indicate status. An error state is frequently shown in red. However, if the text describing the error is too small to distinguish color, it could be missed as an error. Furthermore, the color red is prosperous in China. These are all reasons why we should not rely on color alone to indicate status. I recommend having two forms of status indication; one can be color where cultural sensitivity is considered and some other pattern to support the status.

Another area where color is used is to indicate deviations between near identical entities. This can commonly be found in elements like data visualizations (ie., charts) but can also be found when segregating users in a list of contacts. Changes of color here are meant to separate like items.

I can tell you from experience that I often have difficulty identifying the parts of a data visualization that relies on color to show data. You can imagine how much harder it would be for a blind user to experience. This is again why more emphasis should be given toward presenting the data inclusively, perhaps using a table, and also include a progressive enhancement through a visualization. Putting the color before the data is only helpful for some; let's consider being help for all.