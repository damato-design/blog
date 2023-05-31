---
title: Token operations
desc: Defining transforms into a specification.
heat: 2
date: 2023-05-31
---

I have been revisiting the infrastructure which supports themes at my day job where the number of tokens has exploded into the hundreds; thousands if you count the possibilities of defining custom ones for special needs. This makes the token curation process unwieldly when theming because assigning values to over 500 semantic tokens is very tedious.

The trouble is that while a certain brand or theme might have a few base values which give it personality, the final collection of tokens to define a theme will require slight variations of these base values for a properly curated presentation.

What if we could instead allow for a few values to be set in a theme to inform the rest of the values in some specified way?

## Operations

[First suggested within the Design Tokens Community Group by Jerome Farnum](https://github.com/design-tokens/community-group/issues/88#issuecomment-1029905903) we could consider a special key on the specification that expects an order of operations to be performed ([example from James Nash](https://github.com/design-tokens/community-group/issues/88#issuecomment-1073374383)):

```json
{
  "some-token": {
    "$value": "#ff0000",
    "$type": "color",
    "$operations": [
       { "hue": -20 },
       { "alpha": 0.3 } 
    ]
  }
}
```

This is a good start but I saw two major flaws with this approach:

### Freeform naming

The words `hue` and `alpha` are meant to reference some external function that must exist in the token processing in order to transform to a final value. The algorithms used to determine the final output might be different or not exist at all. Each vendor must implement their own `hue` and `alpha` functions in order for these to be useful. This would require the specification to outline _every_ kind of possible transform a theme author might want to use.

### Custom functions

Furthermore, theme curators could be interested in creating their own custom functions which would need to be executed in vendors' processes. In this format, there's no clear way to define this. We can't even support multiple arguments in the current suggestion.

## Step-by-step

The solution I have for this is to implement a low-level language that can be built upon to make more complex functions. Here's an example of what a token file could look like with a new take on `$operations`:

```json
{
  "primary-color-overlay": {
    "$type": "color",
    "$value": "#fffc00",
    "$operations": [
      0.5,
      ["String.match", "$value", "#([0-9A-Fa-f]{2})"],
      ["String.match", "$value", "#(?:[0-9A-Fa-f]{2})([0-9A-Fa-f]{2})"],
      ["String.match", "$value", "#(?:[0-9A-Fa-f]{4})([0-9A-Fa-f]{2})"],
      ["Math.parseInt", "$1", 16],
      ["Math.parseInt", "$2", 16],
      ["Math.parseInt", "$3", 16],
      ["String.concat", ",", "$4", "$5", "$6", "$0"],
      ["String.concat", "", "rgba(", "$7", ")"]
    ]
  }
}
```

[See minimal prototype in action.](https://replit.com/@fauxserious/TokenOperations)

The `$operations` key is still an array which is necessary to ensure we can have a sequential step. The first concept is that each item (except for the first in this example) is an **operation**. It has the following signature:

```json
["OperationReference", "argument1", "argument2", "argument3",...]
```

The first item in each operation array references some well-known function that can be implemented across token processing tools and vendors. For this to work, I believe we'll need at least `String` and `Math` with a few additional methods to support standard operations (eg., `Math.add`). This is something that can be included in the tokens specification if agreeable.

The result of each operation is stored in a special variable reference related to its index in the operations array. In the example above, the first operation (defined at index `1`) result is stored at `"$1"`. This result is used as an argument in the fifth operation (the first to use `Math.parseInt` above).  Primitive values in the operations array are simply stored as results to the index. Here's the example again, with comments marking how results are stored:

```json
{
  "primary-color-overlay": {
    "$type": "color",
    "$value": "#fffc00",
    "$operations": [
      0.5, // .5 stored at $0
      ["String.match", "$value", "#([0-9A-Fa-f]{2})"], // 'ff' stored at $1
      ["String.match", "$value", "#(?:[0-9A-Fa-f]{2})([0-9A-Fa-f]{2})"], // 'fc' stored at $2
      ["String.match", "$value", "#(?:[0-9A-Fa-f]{4})([0-9A-Fa-f]{2})"], // '00' stored at $3
      ["Math.parseInt", "$1", 16], // 255 stored at $4
      ["Math.parseInt", "$2", 16], // 252 stored at $5
      ["Math.parseInt", "$3", 16], // 0 stored at $6
      ["String.concat", ",", "$4", "$5", "$6", "$0"], // 255,252,0,0.5 stored at $7
      ["String.concat", "", "rgba(", "$7", ")"] // rgba(255,252,0,0.5) stored at $8
    ]
  }
}
```

This would also include a special `$value` which refers to the original token value.

## Reusing common operations

Clearly, we would not want to write all of these operations in order to apply opacity to a given token each time. We'll need a way to reference a set of operations. This could be supported by allowing an import syntax within the specification. [I've suggested this idea before in the community group.](https://github.com/design-tokens/community-group/issues/210#issuecomment-1501037423) It could look like this for operations:

```json
{
  "primary-color-overlay": {
    "$type": "color",
    "$value": "#fffc00",
    "$operations": [ .5, ["@token-operations/hex-opacity"] ]
  }
}
```

Since the first argument in an operation is meant to be a reference to a function, we could also check for a potential file to import here or have some other special syntax. The result would be to spread the operations related to this reference in place and then transform.

```json
{
  "primary-color-overlay": {
    "$type": "color",
    "$value": "#fffc00",
    "$operations": [.5, ...<@token-operations/hex-opacity">]
  }
}
```

In this way, as long as token processors include the low-level operational functions and the standardized way to execute them, you can define any kind of transform you need right within the token file.