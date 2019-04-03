# Value converter: `select`

Represents a value converter that takes a key, and selects the corresponding value from a `Map`, `Object` or `Array`, or a default value, if specified,

## Example

Let's say we have a message that informs the user that something just crashed, where `something` is a variable.

> "${something} just crashed"

When translating this to Polish we have a problem, as one of the words become dependent on the gender of `something`.<br>
Here we can use the `select` converter to select the correct word based on a `gender` property on `something`, with a default that will be selected if none of the keys in the object match the property value, or if the property value is undefined.

> ${something} {something.gender | select: { masculine: 'uległ', feminine: 'uległa' } : 'uległo' } awarii
