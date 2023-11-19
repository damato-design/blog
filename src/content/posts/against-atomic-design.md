---
title: Against atomic design
desc: There's something about it that is more harmful than helpful. 
heat: 2
date: 2022-05-25
animal: shark
---

Atomic design as an idea I agree with; parts of your system are built from smaller parts. What I don't agree with is the image that has been floating around the internet which introduces people to the concept:

![Atomic design guide showing small parts becoming larger](/images/brad-frost-atomic.png)

If you think about this, how could an organism (a living thing) become a template (a non-living thing)? If you think I'm taking the image too literally; that's the point. People around the design community have taken the naming convention provided by design as the standard and using it to communicate where something lives within the system.

So here's a simple question, where would I find the dropdown component in this system? If you know about atomic design this is probably a molecule. If you _don't know_ about atomic design (perhaps like many engineers looking for a component), then it could be a molecule or an organism by process of elimination.

However, even if you know about atomic design the examples can also conflict. The canonical example of an organism in [the original post](https://bradfrost.com/blog/post/atomic-web-design/) is a masthead. However, the masthead could be a reusable template because the megamenu within the masthead could be a organism. The lines become blurry about what exists at each level even for folks who follow atomic design. There's a lots of room for debate about what a particular part of the interface should be categorized as. That debate will only cause confusion and distract from the purpose of the idea.

So here's the easy fix:

![Atomic design guide showing small parts becoming larger](/images/revised-atomic.png)

**#naming-is-hard**. The naming is what hurts the approach.

## Definitions

I'm going to also include some definitions that I've developed while working with design system people and resources that might help bridge communications across disciplines.

- **Product teams**: The group of individual contributors who are responsible for bringing product concepts to life; commonly comprised of designers and developers.
- **Patterns**: Recommended, content-agnostic compositions that have not yet been formally named or packaged which are meant to host content, interactivity or feedback for product team use.
- **Components**: Patterns that have been promoted to reusable packaged resources which simplify the options that the original pattern suggested using internal logic.
- **Fragments**: Components only meant to be used to compose more complex components. These are not commonly used by members outside of the team responsible for them. An example might be a modal backdrop.
- **Local Components**: Components meant to support a specific product or feature.
- **Universal Components**: Components meant to support all products and features.
- **Layouts**: Reusable compositions for visual arrangement; analogous to the use within artboards.
- **Templates**: Reusable compositions for data arrangement; analogous to the use within database schemas.
- **Modules**: Components populated and configured by people outside of product teams.

The reason we give names to anything is to share ideas. If the name doesn't properly identify the idea in a repeatable way; it's a signal that the name doesn't support the idea well. My recommendation is to not take the atomic design system naming convention literally but instead to execute on the concept that an interface is a collection of increasing complex compositions. The naming used within the system should be developed so that it meets expectations for most introduced to the system and limits ambiguity.