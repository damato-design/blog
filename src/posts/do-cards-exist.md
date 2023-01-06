---
title: Do cards exist
desc: I argue that a card shouldn't be categorized as a component and instead exist as another concept entirely.
heat: 3
date: 2022-12-13
draft: true
---

There are [79 examples for the card component](https://component.gallery/components/card/) found at [The Component Gallery](https://component.gallery/components/); easily in the top 10 most found across the showcased design systems. It seems obvious that the card is something that becomes one of the resources found in most libraries.

## OUTLINE

- Have 5 designers draw a card versus any other component
- Is everything a component?
  - Could an entire page be a component? Why might this feel awkward?
    - Pages have different purposes.
    - Pages are made of smaller pieces.
  - It might feel more comfortable to categorize a page as a composition.
- What is a component?
  - Most definitions are fast and loose
    - https://design-system.service.gov.uk/components/
    - https://carbondesignsystem.com/components/overview/
    - https://atlassian.design/components/
    - Including my own ./against-atomic-design
  - A reusable packaged resource with a unique generic purpose and consistent layout composition.
    - Reusable packaged resource means it comes as one asset.
    - Unique generic purpose means that the resource has one reason to exist in relation to other components.
    - Consistent layout composition means that its construction does not vary given the same content.
- What is a card?
  - A card is a composition representing an entity. It comes with much of the same elements as a simple web page.
  - Often the card could be a text/image link or a bulletpoint instead.
  - Most entities have a stakeholder.
  - Several variations of Compass listing card, owned by the listing team.
  - The way a recipe is meant to be portrayed is likely different from a movie you can watch now.

Most attempts found in design systems in defining a component are fast and loose.

What makes a button a component, and a stylized box not a component?

A component has three basic features: content, layout, and style. Changing the style (color, typography, spacing, roundness, etc) doesn't alter the purpose of the component. (caveat with errors but shouldn't only be represented using style). Changing the content alters the message; the same kind of component can be used to message the user that they've won one million dollars or that we've logged them out. Different component, same layout and style.

So what drives the possibility of different layouts? 

The button has a unique purpose which does not change after customization.

Have you come across buttons having icons with conflicting placement? Some icons appear on the left of the text label, some on the right? If you have an opinion about how this should be handled, then you should also agree that a card is not a component.

For systems which have guidelines for composition, this is solved by restricting the interface for the component, configured in such a way which makes choices on behalf of the author based on the guidelines of the system. This will cause a supplied icon to always appear on one side of the text label, so that the author doesn't need to lookup the guidelines. This button will be presented like all other buttons in the system automatically.

On the other hand, allowing the icon to appear on either side allows for cases where the guidelines might be unclear. A chevron icon shouldn't appear on the left, only on the right. How do I get it there?

There exists a spectrum:

Unrestricted ------- [you are somewhere here] -------- Restricted

The more restrictive the composition expectations are, the more usage aligns according to design guidelines. The less restrictive composition expectations are, the more freedom designers have.

Gestalt theory suggests that the whole is something different than the sum of its parts. 

When you have different customizations between cards, does they still serve the same purpose?

If you have a icon-button and a text-button, but they are both interactive and execute as expected, they both serve the same purpose.

If you have a movie-card and a recipe-card, they do not serve the same purpose. The purpose is driven by the content.

How does field frame fit into this narrative? The expectations are more well-defined. Elements can only exist in a row and the kinds of elements are restrictive.

The composition is not subject to change based on external factors.