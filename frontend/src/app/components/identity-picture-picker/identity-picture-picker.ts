import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import gravatarUrl from "gravatar-url";
import { Operation, EventManager } from "shared/utilities";
import { Log, ApiResult } from "shared/infrastructure";
import { pickAndUploadFile } from "shared/framework";

/**
 * Represents a picker component for specifying an identity picture.
 */
@autoinject
export class IdentityPicturePickerCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which this attribute is applied.
     */
    public constructor(element: Element)
    {
        this._element = element as HTMLElement;
    }

    private readonly _element: HTMLElement;
    private readonly _eventManager = new EventManager(this);

    /**
     * The pending upload operation, if any.
     */
    protected uploadOperation: Operation<ApiResult> | undefined;

    /**
     * True to show the options for changing the picture, otherwise false.
     */
    protected showChangeOptions = false;

    /**
     * The URL for the picture, if specified.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: string | undefined;

    /**
     * The string or strings from which initials should be generated when no picture is specified,
     * or undefined to not show an option to use initials.
     */
    @bindable({ defaultValue: undefined })
    public initials: (string | undefined)[] | string | undefined;

    /**
     * The email or identifiers that may be used to generate a Gravatar URL,
     * or undefined to not show an option to use Gravatar.
     */
    @bindable({ defaultValue: undefined })
    public gravatar: (string | undefined)[] | string | undefined;

    /**
     * True if the input is disabled, otherwise false.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * True if the input is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * True if the input is busy fetching the picture, otherwise false.
     */
    @bindable({ defaultValue: false, defaultBindingMode: bindingMode.twoWay })
    public busy: boolean;

    /**
     * The initials to show in the identity picture.
     */
    @computedFrom("initials.length")
    protected get formattedInitials(): (string | undefined)[] | undefined
    {
        const strings = typeof this.initials === "string" ? [this.initials] : this.initials;

        return strings?.map(s => s?.trim()[0] ?? undefined);
    }

    /**
     * The computed identifier used to generate a Gravatar URL.
     */
    @computedFrom("gravatar.length")
    protected get gravatarIdentifier(): string | undefined
    {
        const strings = (this.gravatar instanceof Array ? this.gravatar : [this.gravatar]);

        if (strings.length === 0 || strings.includes(undefined))
        {
            return undefined;
        }

        let string = strings.slice().join("/");

        if (strings.length > 1 || !string.includes("@"))
        {
            string = `@lingu/${string}`;
        }

        return string.trim().toLowerCase();
    }

    /**
     * The Gravatar URL for the specified email or identifiers.
     */
    @computedFrom("gravatarIdentifier")
    protected get gravatarUrl(): string | undefined
    {
        const identifier = this.gravatarIdentifier;

        if (identifier == null)
        {
            return undefined;
        }

        return gravatarUrl(identifier, { default: "identicon", size: 256 });
    }

    /**
     * Called by the framework when the `value` property changes.
     * Ensures any pending upload operation is aborted.
     */
    protected valueChanged(): void
    {
        this.uploadOperation?.abort();
        this.uploadOperation = undefined;
    }

    /**
     * Called when the `Change` button is clicked.
     * Presents the options for changing the picture.
     */
    protected onChangeClick(): void
    {
        this.showChangeOptions = true;

        this._eventManager.addEventListener(document, "focusin", event =>
        {
            if (!this._element.contains(event.target as any))
            {
                this.showChangeOptions = false;
            }
        });
    }

    /**
     * Called when the `Use Gravatar` button is clicked.
     * Assigns the Gravatar URL as the input value.
     */
    protected onUseGravatarClick(): void
    {
        this.cancelChange();

        this.value = this.gravatarUrl;
    }

    /**
     * Called when the `Use initials` button is clicked.
     * Assigns the value undefined as the input value.
     */
    protected onUseInitialsClick(): void
    {
        this.cancelChange();

        this.value = undefined;
    }

    /**
     * Called when the `Upload picture` button is clicked.
     * Opens a file picker, uploads the picked file, and assigns the picture URL as the input value.
     */
    protected async onUploadPictureClick(): Promise<void>
    {
        const fileUploadRequest = await pickAndUploadFile("post", "files/upload/public", undefined, ".jpg,.png");

        if (fileUploadRequest == null)
        {
            return;
        }

        this.cancelChange();

        try
        {
            this.busy = true;
            this.uploadOperation = fileUploadRequest.operation;

            const apiResult = await this.uploadOperation.promise;

            this.value = apiResult.data.url;
        }
        catch (error)
        {
            Log.error("Failed to upload the picture.", error);
        }
        finally
        {
            this.uploadOperation = undefined;
            this.busy = false;
        }
    }

    /**
     * Aborts any pending operation and reverts to showing the `Change` button.
     */
    private cancelChange(): void
    {
        this.uploadOperation?.abort();
        this.uploadOperation = undefined;

        this.showChangeOptions = false;

        this._eventManager.removeEventListeners();
    }
}
