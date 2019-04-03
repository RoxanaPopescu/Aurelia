# Framework

The framework defines classes that can be used across the application to apply styling
or animation to elements, to control layout, and to indicate state.

## Setting the theme context

The framework has a concept of *context*, allowing parts of the DOM to be marked as
containing different kinds of content, requireing different variations of the styles.

For example, while the application interface and marketing material might all use e.g.
the same font style, the appearance of that style will depend on the context.

The context is set by applying the `theme-context` attribute, which supports two values:

* `app` which indicates that the element represents an application.

* `marketing` which indicates that the element represents marketing content.
