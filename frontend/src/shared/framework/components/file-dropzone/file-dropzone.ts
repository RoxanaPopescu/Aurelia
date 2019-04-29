import { autoinject, bindable } from "aurelia-framework";
import Dropzone from "dropzone";

// tslint:disable-next-line: no-submodule-imports
import "dropzone/dist/dropzone.css";

/**
 * Represents a file upload component, providing a dropzone
 * and an option to browse the local file system.
 */
@autoinject
export class FileDropzoneCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element representing the component.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;

    /**
     * The options to use for the dropzone.
     * See: https://www.dropzonejs.com/#configuration
     */
    @bindable
    public options: Dropzone.DropzoneOptions;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        // tslint:disable-next-line: no-unused-expression
        new Dropzone(this._element, this.options);
    }
}
