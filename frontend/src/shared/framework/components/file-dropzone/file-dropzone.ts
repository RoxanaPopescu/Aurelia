import { autoinject, bindable, bindingMode } from "aurelia-framework";
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
     * The `Dropzone` instance attached to this component.
     * See: https://www.dropzonejs.com/#configuration
     */
    @bindable({ defaultBindingMode: bindingMode.fromView })
    public dropzone: Dropzone;

    /**
     * The options to use when attaching the `Dropzone`.
     * See: https://www.dropzonejs.com/#configuration
     */
    @bindable
    public options: Dropzone.DropzoneOptions;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        if (this.dropzone == null)
        {
            this.dropzone = new Dropzone(this._element, this.options);
        }
    }
}
