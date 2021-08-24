import { autoinject, bindable, bindingMode, computedFrom } from "aurelia-framework";
import gravatarUrl from "gravatar-url";
import { Operation } from "shared/utilities";
import { Log, ApiResult } from "shared/infrastructure";
import { LabelPosition, AutocompleteHint, EnterKeyHint, pickAndUploadFile } from "shared/framework";

/**
 * Represents an input component for specifying an identity picture.
 */
@autoinject
export class IdentityPictureInputCustomElement
{
    /**
     * The pending upload operation, if any.
     */
    protected uploadOperation: Operation<ApiResult> | undefined;

    /**
     * The position of the label, relative to the input.
     */
    @bindable({ defaultValue: undefined })
    public label: LabelPosition | undefined;

    /**
     * The URL for the picture, if specified.
     */
    @bindable({ defaultValue: undefined, defaultBindingMode: bindingMode.twoWay })
    public value: string | undefined;

    /**
     * The string or strings from which initials should be generated when no picture is specified,
     * or undefined to not show any initials.
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
     * The autocomplete mode to use.
     */
    @bindable({ defaultValue: "off" })
    public autocomplete: AutocompleteHint;

    /**
     * True to select the contents when the input is focused, otherwise false.
     */
    @bindable({ defaultValue: false })
    public autoselect: boolean;

    /**
     * The hint indicating the type of `Enter` key to show on a virtual keyboard,
     * or undefined to use the default behavior.
     */
    @bindable({ defaultValue: undefined })
    public enterkey: EnterKeyHint | undefined;

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

        return gravatarUrl(identifier, { default: "identicon" });
    }

    /**
     * Called by the framework when the `value` property changes.
     * Ensures any pending upload operation is aborted.
     */
    protected valueChanged(): void
    {
        this.uploadOperation?.abort();
    }

    /**
     * Called when the `Use Gravatar` button is clicked.
     * Assigns the Gravatar URL as the identity picture URL.
     */
    protected useGravatarClick(): void
    {
        this.uploadOperation?.abort();

        this.value = this.gravatarUrl;
    }

    /**
     * Called when the `Choose picture` button is clicked.
     * Opens a file picker, uploads the picked file, and assigns the picture URL as the identity picture URL.
     */
    protected async choosePictureClick(): Promise<void>
    {
        this.uploadOperation?.abort();

        const fileUploadRequest = await pickAndUploadFile("post", "pictures", undefined, ".jpg,.png");

        if (fileUploadRequest == null)
        {
            return;
        }

        try
        {
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
        }
    }
}
