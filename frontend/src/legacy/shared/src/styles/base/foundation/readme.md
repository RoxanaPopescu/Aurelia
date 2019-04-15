# Foundation

The foundation defines styles for the document elements defined in the HTML standard, thereby
normalizing browser diferences and providing reasonable defaults.

Note that the default styles for some elements, such as headings, lists, blockquotes and tables,
are intentionally minimal, thus allowing those elements to be used for their semantic meaning,
while their apperance can be modified by applying classes provided by the framework.

## Setting the document type

By default, the foundation assumes the document represents a scrollable page of user selectable
content, such as e.g. a marketing page.

If the document represents an app, which handles its own scrolling and where user selection should
only be enabled where actual content is presented, apply the class `app` to the `html` element.

## Managing focus visibility

By default, the foundation applies no outline to the currently focused element. To enable focus
outlining within an element, e.g. during keyboard navigation, apply the class `focus-visible`.
