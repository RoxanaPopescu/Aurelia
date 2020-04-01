import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation } from "shared/framework";
import { CommunicationService, CommunicationTrigger } from "app/model/_communication";

/**
 * Represents the route parameters for the page.
 */
interface IRouteParams
{
    /**
     * The slug identifying the trigger, or undefined if new.
     */
    slug?: string;
}

/**
 * Represents the page.
 */
@autoinject
export class DetailsPage
{
    /**
     * Creates a new instance of the class.
     * @param communicationService The `CommunicationService` instance.
     */
    public constructor(communicationService: CommunicationService)
    {
        this._communicationService = communicationService;
    }

    private readonly _communicationService: CommunicationService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The model to present.
     */
    protected model: CommunicationTrigger;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(params: IRouteParams): Promise<void>
    {
        if (params.slug != null)
        {
            this.model = await this._communicationService.get(params.slug);
        }
        else
        {
            this.model = new CommunicationTrigger();
        }
    }

    /**
     * Called when the "Save changes" og "Create trigger" button is clicked.
     * Saves the model.
     */
    protected async onSaveClick(): Promise<void>
    {
        // Activate validation so any further changes will be validated immediately.
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            if (this.model.slug == null)
            {
                await this._communicationService.create(this.model);
            }
            else
            {
                await this._communicationService.update(this.model);
            }
        }
        catch (error)
        {
            Log.error("Could not save the route planning settings", error);
        }
    }
}
