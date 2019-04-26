import { autoinject, bindable } from "aurelia-framework";

/**
 * Represents the picture for an identity component.
 * When no picture is available, the element will be a surface presenting
 * the content of the element instead, which may be e.g. initial letters
 * that hint at the identity represented by the picture.
 */
@autoinject
export class IdentityPictureCustomElement
{
    /**
     * The URL of the image to show, if available.
     */
    @bindable
    public src: string | undefined;
}
