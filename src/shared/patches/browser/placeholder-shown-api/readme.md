# Extend native form controls with a `placeholderShown` property

> **Warning**<br>
> This adds non-standard members to native elements.

## Problem

Native form controls support a CSS pseudo class called `:placeholder-shown`, but do not expose a corresponding JavaScript API.

This is generally not a problem, as the placeholder state can be inferred based on the `value` property of the control. Unfortunately, this solution breaks when combined with the form auto-filling features provided by some browsers.

As a security measure to prevent scraping of login credentials and other sensitive information that may be auto-filled, some browsers show the auto-fill value in the control, but defer setting the `value` property of the control, until after a human-initiated event occurs on the page.

This is a problem for custom form controls that wish to show their own placeholder element, instead of the one provided by the native control - if the custom control is unaware of the auto-fill value being presented, its placeholder and the auto-fill value may overlap.

## Solution

To solve this problem, we apply animations that triggers when the `:placeholder-shown` pseuto class is added or removed on elements of type `input`, `textarea` and `select`. We then listen for the `animationstart` event at the document level, filter by animation name, and set a custom, non-standard `placeholderShown` property on the element from which the event originated.
