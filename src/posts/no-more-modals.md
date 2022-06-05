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

Let's be clear here, I'm not recommending to remove _all_ modals from experiences. As mentioned above, if the user was able to delete their profile, a modal confirming the action would be helpful for the reasons stated above.

It's common to find modals used to login or signup. Consider using a separate page unless you allow the user to make customizations before creating an account. In this case, you'll consider using a modal to show progress is maintained while they complete the signup process. Make sure the signup process is reduced down to the essential fields. Allow the user to include additional information later in their profile.

[NN/Group](https://www.nngroup.com/) also provides a few additional recommendations for when to use modals. One of the examples is a wizard which breaks down a complicated workflow into steps. What's important here is the second paragraph:

{% quote, "https://www.nngroup.com/articles/modal-nonmodal-dialog" %}
However, it’s important to note that a modal with multiple steps will just prolong the amount of time spent away from the main tasks, making it more likely that users will forget what they were doing in the first place.
{% endquote %}

