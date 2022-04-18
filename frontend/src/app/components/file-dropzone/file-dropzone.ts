import Dropzone from "dropzone";
import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { IdentityService } from "app/services/identity";
import settings from "resources/settings";

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
     * @param identityService The `IdentityService` instance.
     */
    public constructor(element: Element, identityService: IdentityService)
    {
        this._element = element as HTMLElement;
        this._identityService = identityService;
    }

    private readonly _element: HTMLElement;
    private readonly _identityService: IdentityService;

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
     * Called by the framework when the component is binding.
     */
    public bind(): void
    {
        if (this.dropzone == null)
        {
            this.dropzone = new Dropzone(this._element,
            {
                ...this.options,
                headers:
                {
                    ...settings.infrastructure.api.defaults?.headers,
                    authorization: this._identityService.identity!.tokens.accessToken,
                    ...this.options.headers
                }
            });
        }
    }
}
