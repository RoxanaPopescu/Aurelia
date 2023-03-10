import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import settings from "resources/settings";

/**
 * Value converter that converts an image ID to an object that will, once resolved, contain info about the image,
 * such as its URL. Note that if the image is stored in secure storage, the URL may be temporary.
 */
@autoinject
export class ImageInfoValueConverter
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Converts the value for use in the view.
     * @param value The ID of the image.
     * @param secure True if the image is stored in secure storage.
     * @returns An object that will, once resolved, contain info about the specified image.
     */
    public toView(value: string, secure = false): { url: string } | undefined
    {
        if (value == null)
        {
            return undefined;
        }

        const imageInfo = { resolved: false } as any;

        if (!secure)
        {
            imageInfo.url = `${settings.app.publicImageBaseUrl}${value}`;
            imageInfo.resolved = true;
        }
        else
        {
            this._apiClient.get(`files/sensitive/${value}`).then(result =>
            {
                imageInfo.url = result.data.url;
                imageInfo.resolved = true;

            }).catch(error => console.log(error));
        }

        return imageInfo;
    }
}
