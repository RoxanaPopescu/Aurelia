import { autoinject, bindable, Container } from "aurelia-framework";
import { Callback } from "shared/types";
import { TagsInputCustomElement } from "./tags-input";

/**
 * Custom element representing a tag in a tags input.
 */
@autoinject
export class TagCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param container The `Container` instance associated with the component.
     */
    public constructor(container: Container)
    {
        if (container.hasResolver(TagsInputCustomElement, true))
        {
            this.tagsInput = container.get(TagsInputCustomElement);
        }
    }

    /**
     * The `tags-input` associated with the tag, if any.
     */
    protected readonly tagsInput: TagsInputCustomElement | undefined;

    /**
     * The value associated with the element.
     */
    @bindable
    public model: any;

    /**
     * Called when the remove icon is clicked.
     */
    @bindable
    public remove: Callback | undefined;

    /**
     * Called when the remove icon is clicked.
     * Removes the tag from the input value.
     * @returns False to prevent default.
     */
    protected onRemoveMouseDown(): boolean
    {
        if (this.remove != null)
        {
            this.remove();
        }

        if (this.tagsInput != null)
        {
            this.tagsInput.deselectItem(this.model);
        }

        return false;
    }
}
