---
title: Spicy specifications
desc: Making sense of several solutions for design decisions aimed to help our community.
heat: 2
date: 2023-06-23
---

Figma's design conference [Config](config.figma.com) just ended and one of the biggest announcements is the introduction of [Variables](https://twitter.com/figma/status/1671563489457090560). The reaction from the community is a mix of emotions. While many people were expecting Design Tokens, some can see the clear benefits of Variables while others are skeptical about perceived defiance to existing specifications. We'll explore the current state of specifications for Design Tokens across the community and how Variables come into play. 

## Token specifications today

These are a few popular or relevant specifications that aim to describe the shape of a Design Token. While I haven't completed an exhaustive search through existing systems with their own formats, the following examples will be enough to illustrate the current state of affairs.

### Design Tokens Community Group

The [Design Tokens Community Group](https://www.w3.org/community/design-tokens/) (DTCG) is a collection of Design Tokens stakeholders from around the community representing design and development tools along with experts with working knowledge and experience in maintaining token libraries. The group has made some strides in a specification but it is very far from complete. The expectation is that all tools should adhere to this specification so that our representation of Design Tokens can be shared across tools. If there are deviations, a tool may skip a definition or fail. Here's a basic example of a Design Token meant to describe a token `color-red-500`.

```json
{
    "colors": {
        "color-red-500": {
            "$type": "color",
            "$value": "#f00",
        }
    }
}
```
[Reference](https://tr.designtokens.org/format/)

This is the core of the DTCG specification; a nested object with unique names. At the lowest nesting there should exist `$type` and `$value` keys; where the `$` denotes a special key that is meaningful for tools to read. In the example, the tool should know that the `#f00` is a color value and handle it accordingly. There are a few other keys and other more complex configurations, but this is the foundation that everyone is expected to follow.

### Tokens Studio

[Tokens Studio](https://tokens.studio/) (built from a plugin project called [Figma Tokens](https://jansix.at/resources/figma-tokens)) has had a longer history of use ([Jun 2020](https://github.com/tokens-studio/figma-plugin/releases/tag/0.1)) than the first agreement provided by the DTCG ([Apr 2021](https://www.w3.org/community/design-tokens/2021/04/17/first-editors-draft-shared-with/)). This was to fill needs that were not solved within Figma at the time. Therefore, their specification is slightly different.

```json
{
    "colors": {
        "color-red-500": {
            "type": "color",
            "value": "#f00"
        }
    }
}
```

[Reference](https://docs.tokens.studio/tokens/json-schema#multiple-files-storage)

Note that the above is for a multi-file storage configuration. There are special keys expected at the first nesting level when using single-file storage. Also, note the absence of `$` from the `type` and `value` which is not to DTCG specification today. [Mike Kamminga, Tokens Studio CEO, says](https://twitter.com/mikekamminga/status/1671572520955256849):

> We have been transitioning to fully support the DTCG proposal.

Importantly, to support more complex customer needs, Tokens Studio has included additional features that the DTGC specification has not yet provided. Continued from the previous quote:

> ...we do fill some gaps where the proposed spec doesn't provide solutions yet.

[An example of filling gaps](https://github.com/tokens-studio/resolver-spec/blob/master/schema.json) comes in the form of token [resolvers](https://tokens.studio/tools/resolvers) which aim to describe complex relationships and conditionals which compute token values. While [this has been suggested within the DTCG discussions](https://github.com/design-tokens/community-group/issues/210#issuecomment-1553011810), there are no official recommendations.

### Specify

[Specify](https://specifyapp.com/) is a design token management tool that has been around before the DTCG and has had [integrations with Sketch](https://web.archive.org/web/20190305103656/https://specifyapp.com/) before Figma. A few weeks ago, [they announced](https://specifyapp.com/blog/specify-design-token-format) the Specify Design Token Format (SDTF). An excerpt from their example is below:

```json
{
    "colors": {
        "color-red-500": {
            "$type": "color",
            "$value": {
                "default": {
                    "model": "hex",
                    "hex": "#f00",
                    "alpha": 1,
                }
            }
        }
    }
}
```

[Reference](https://specifyapp.com/blog/specify-design-token-format)

The standout part of the above is the `$value` which is more descriptive than the others, containing more information about the value than only the string. As of today, this does not follow the DTCG specification but perhaps that's by design. [Nicolas André, Specify Senior Software Engineer, says](https://twitter.com/nclsndr/status/1669374223914024962):

> The SDTF is not a file. The SDTF is designed to be a transport format between APIs that would eventually being configured by humans. To interact with it, we’ll use dedicated APIs lowering the underlaying complexity.

So the expectation here is that there are additional external systems that exist between APIs that expect this format.

## Why not Design Tokens?

[Jacob Miller, Figma Design Advocate, says](https://twitter.com/pwnies/status/1671597246113280001):

> Our reasons for naming it variables was primarily to align with development. Variables, much like css variables, is not just for design tokens, it's also for conditional logic, string translations, etc.

{% aside %}
I disagree with the comparison to CSS, as [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) are meant for style as Design Tokens are. I believe it would have been more accurate to compare using another language like JavaScript. Though I imagine the comparison was done to suggest how you might use Variables to result in style.
{% endaside %}

The important takeaway here is that Variables can be used to describe our idea of Design Tokens but also to support additional needs which will most likely exist outside Design Token expectations. A clear example of this is content substitutions for localization. Design Tokens were not created to support this foundationally but Variables, _uniquely defined by Figma_, can.

For reference here is an example of a Figma Variable:

```json
{
   "id": "<FIGMA_INTERNAL_VARIABLE_ID>",
   "name": "color-red-500",
   "resolvedType": "COLOR",
   "valuesByMode": {
    "<FIGMA_INTERNAL_MODE_ID>": "#f00"
   }
}
```

[Reference](https://www.figma.com/plugin-docs/api/Variable)

This is not a Design Token but Figma's proprietary format meant for use within the Figma ecosystem. [Based on the official plugin built to transform Variables into Design Tokens](https://github.com/figma/plugin-samples/blob/c91a1e2e02d6c6f100d7651d055ef84725adbb5d/variables-import-export/code.js#L136), the `valuesByMode` will store several values by a unique identifier that relates to a mode. The mode could be light, dark, dense, Spanish, or many others and the value for this Variable can differ depending on the mode.

{% aside %}
[Jacob proposed](https://github.com/design-tokens/community-group/issues/210) how modes might look in the official DTCG specification. The discussion is one of the largest within the group and is currently unresolved.
{% endaside %}

## A deliberate choice

Figma has intelligently chosen the word "Variable" to opt out of following the specification to support its product features but also offers the import/export of the DTCG specification where appropriate against its Variables. I believe this is the correct direction as the DTCG learns from existing patterns. This allows Figma to go far beyond the responsibility of the specification in ways Design Tokens were never meant to be used.

You could argue that Token Studio and Specify are also behaving in the same way. However, I fear their current offerings are confusing when compared with the DTCG. Again, Figma made a conscious decision to create a unique ecosystem to allow for new features to be built; **Variables are not Design Tokens**. This is a subtle but important distinction as the other products create their own variations on top of an incomplete specification using conflicting methodologies. In other words, one cannot use a fully featured Tokens Studio file within Specify due to the incompatibility between specifications.

![Will the real design tokens please stand up?](../images/design-tokens-spiderman.jpg)

I believe the root of the problem is using the name Design Token for experimental approaches while a group aims to define what it means to be a Design Token. These other formats do not follow the specification in small and large ways and are therefore not accurate in describing Design Tokens as we expect them to be used in the community universally. Rebranding these novel approaches as something else for future features (as Figma has done) would make the expectations and responsibilities of Design Tokens more understandable to the community moving forward.

I have empathy for the pioneers like Tokens Studio and Specify; existing before the specification makes this exceptionally challenging for them, borderline unfair. What Specify has done is a good start; creating a branded "flavor" of Design Tokens with the SDTF. I'd recommend Token Studio do something similar such as TSTF. In this way, it can be perceived that these approaches are Design Token _adjacent_ instead of wholly accurate to the community specification.

Let me be clear, I support the advancements that all of these companies are providing for the Design Tokens community. They are heavily influencing the direction of the specification and we could not be where we are today without this work. I am being critical of what a Design Token is expected to be as it currently depends on where you get your tokens from. I have confidence that alignment will come, it's simply a noisy time to get started.