import { autoinject, bindable } from "aurelia-framework";
import { TagsInputCustomElement } from "./tags-input";

/**
 * Custom element representing a tag in a tags input.
 */
@autoinject
export class TagCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param element The element representing the component.
     */
    public constructor(tagsInput: TagsInputCustomElement)
    {
        this._tagsInput = tagsInput;
    }

    private readonly _tagsInput: TagsInputCustomElement | undefined;

    /**
     * The value associated with the element.
     */
    @bindable
    public model: any;

    /**
     * Called when the remove icon is clicked.
     * Removes the tag from teh tag input value.
     * @returns False to prevent default.
     */
    protected onRemoveMouseDown(): boolean
    {
        const index = this._tagsInput!.value.indexOf(this.model);
        this._tagsInput!.value.splice(index, 1);

        return false;
    }
}
