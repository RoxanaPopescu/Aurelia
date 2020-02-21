import { autoinject, customAttribute, bindable, bindingMode } from "aurelia-framework";
import { EmptyCustomAttribute } from "../empty/empty";

import "./empty-value.scss";

/**
 * Custom attribute that determines whether the element is empty, and shows a placeholder if it is.
 * Note that non-visual elements are ignored, and by default, whitespace is ignored too.
 */
@autoinject
@customAttribute("empty-value")
export class EmptyValueCustomAttribute extends EmptyCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is applied.
     */
    public constructor(element: Element)
    {
        super(element);
    }

    /**
     * The name of the attribute.
     */
    protected attributeName = "empty-value";

    /**
     * True if the element is empty, otherwise false.
     */
    @bindable({ primaryProperty: true, defaultBindingMode: bindingMode.fromView })
    public value: boolean;

    /**
     * True to ignore whitespace, otherwise false.
     */
    @bindable({ defaultValue: true, changeHandler: "onContentChanged" })
    public ignoreWhitespace: boolean;
}
