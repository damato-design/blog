---
title: No more modals
desc: There's a trend in design that more and more experiences are being put into a modal. We'll explore this as a pattern and why we should often reconsider our decision to use them. 
emoji: 🎈
date: 2022-06-05
---

Have you ever landed on a web page and have it immediately ask you for a location? How about while you are reading an article and, after you scroll down to read more, you get an advertisement covering your next paragraph? These are super annoying patterns but why are they annoying?

## Surprising popups

When a user has a specific goal in mind and an interruption occurs, the user will find it annoying if that interruption does not relate to their current workflow. This can be expanded to any generic UX pattern; where expectations aren't met and frustration increases. However, there is a special place for popups because they _interrupt_.

There is a fine line between the popup and the modal. **The modal _must be related_ to the user's current workflow**. This means that the user triggered this popup and it meets the user's expectations.

## Reasons to use a modal

The designer could choose a modal to interrupt the user (as all popups do) and cause the user to slow down for some important information in order to proceed. A good example is the destructive confirmation modal which helps ensure that the delete button press was intended. The user is expected to do a bit more work here so important data isn't erased. So, the designer requires one more hit target to be pressed before continuing. The modal here also shows that the user can return to the original state just behind the message and that nothing has changed yet.

Along with this previous idea, another valid reason to provide a modal is to show the user that they are still within the current context. A good example here is adding an image to a blog post. It would be more helpful to show that the user's content remains while completing a new task of selecting an asset from the gallery. If we were to provide a new page for this experience, the user would not be confident that their content was saved. Showing that their content is persistent behind the modal establishes trust that the user will return as they once left.

So to recap, you may consider using a modal:

- if you believe the user must slow down before continuing the current task.
- if you believe the user does not trust that current changes will persist while they need to complete a different but related task.

## Questionable practices

I've seen dozens of workflows using a modal which could have been another pattern entirely:

- If the user could return to the experience using a url; the experience should probably be a new page.
- If the user needs to create or edit an entity with many fields (eg.: a profile, a product); the experience should probably be a new page or incorporated into the current experience.
- If the user needs to edit a value; the experience should probably be incorporated into the current experience.

An example that I've seen recently is a profile review experience. Once clicking your avatar in the application a _modal_ appears above your current workflow. From here you can edit fields and save to return. However, you may also change your avatar photo. After selecting a photo, you are presented _another modal_ allowing the user to resize the photo and save the changes, returning you to the previous modal. So how could this experience be redesigned?

First, clicking on your profile should navigate the user to their profile. We expect this to be a url and therefore a new page. From here, the user is given several fields of values they can edit directly. Let's continue with this pattern by allowing the user to edit their avatar here as well. Use a slider to resize and drag-and-drop to reposition the photo in the thumbnail. The profile would hold the original image and on save, it would provide an avatar sized adjustment of that original for use across the site. We've taken a multi-modal experience to a zero-modal one.

Let's be clear here, I'm not recommending to remove _all_ modals from experiences. As mentioned above, if the user was able to delete their profile, a modal confirming the action would be helpful for the reasons stated above. Although even this could be avoided by requiring the user type a word or phrase into a field before executing the destructive action. It shows deliberate intent over accidental button clicks.

It's common to find modals used to login or signup. Consider using a separate page unless you allow the user to make customizations before creating an account. In this case, you'll consider using a modal to show unauthenticated progress is maintained while they complete the signup process. Make sure the signup process is reduced down to the essential fields. Allow the user to include additional information later in their profile.

[NN/Group](https://www.nngroup.com/) also provides a few additional recommendations for when to use modals. One of the examples is a wizard which breaks down a complicated workflow into steps. What's important here is the second paragraph:

{% quote, "https://www.nngroup.com/articles/modal-nonmodal-dialog" %}
However, it’s important to note that a modal with multiple steps will just prolong the amount of time spent away from the main tasks, making it more likely that users will forget what they were doing in the first place.
{% endquote %}

In my opinion this describes that we _shouldn't_ be using a modal for wizards and instead provide a navigational pattern linking to pages sequentially; allowing the user to return to steps easily. This is also relevant to their following comment about lessening a user's effort. The point of designing an experience is to do just that. So, asking if the user is working with an agent could be a question exposed as a checkbox while filling out the form for a open house. That selection could be saved for subsequent open house requests. This simplifies the experience instead of disrupting the user with a question the system forgot to ask when it was more relevant.

Speaking of the real estate industry, many web sites of this genre use a [lightbox](https://mdbootstrap.com/docs/standard/components/lightbox/) (ie. a carousel in a modal) due to the need for viewing a set of high quality images of a property. Without diving too deeply into [the decision to use a carousel](https://shouldiuseacarousel.com/), the decision to use a modal is debateable. Full screen images could be provided as separate urls; making the photos easily sharable to other interested parties. Closing the experience could return the user back to the listing; just like a close button would. Browser navigation could also assist in wayfinding between photos and the original listing along with common carousel-like controls.

## Accessibility

Attempting to make a modal fully accessible is a serious challenge. For example, you'll need to indicate that a new area of the page has been created, and focus must enter this area and be trapped for the duration of the experience until the task is complete. At which point, focus must return to the initial trigger of the modal. What actually receives focus (a child of the modal or the modal itself) is actually [up for debate](https://www.scottohara.me/blog/2019/03/05/open-dialog.html); making a recommendation for it unclear. Additionally, events should not occur behind the modal which is easier said than done. Even with [the new `inert` attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/inert), ensuring that other elements are still accessible could be tricky with the introduction of third-party resources that need events outside of the modal.

As you might imagine, things become increasing difficult with [more modals](https://github.com/w3c/aria-practices/issues/1241) added to the experience. How to juggle focus? What the screen reader should announce? How to navigate between these popups?

Even [the native `<dialog/>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) [isn't shipped fully accessible](https://a11y-dialog.netlify.app/advanced/dialog-element/). At the moment, we can't even trust the browsers to support accessibility like other elements do. There's no avoiding some amount of custom behavior which is bound to have variations of approach and unintended feature gaps.

## As a design constraint

The modal should not live at the top of the designer's toolbox. Make it a design constraint instead. Explore possible workflows without the modal and see how far you can get. I have confidence that most experiences can avoid the modal pattern for something more useful.

It's important to truly design with emphathy when crafting an experience. Perhaps, we should provide a double confirmation pattern before choosing some design directions? Imagine that!