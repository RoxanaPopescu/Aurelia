import { autoinject } from "aurelia-framework";
import { DriverService, Driver } from "app/model/driver";
import { IValidation } from "shared/framework";

/**
 * Represents the module.
 */
@autoinject
export class MultiCreatePage
{
    /**
     * Creates a new instance of the class.
     * @param driverService The `DriverService` instance.
     */
    public constructor(driverService: DriverService)
    {
        this._driverService = driverService;
    }

    private readonly _driverService: DriverService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The route planning rule set.
     */
    protected driver: Driver;

    /**
     * Called by the framework when the module is activated.
     * @param params The route parameters from the URL.
     * @returns A promise that will be resolved when the module is activated.
     */
    public async activate(): Promise<void>
    {
        this.driver = new Driver();
    }

    /**
     * Called when the "Save changes" or "Create rule set" button is clicked.
     * Saves the route planning settings.
     */
    protected async onAddClick(): Promise<void>
    {
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }


        try
        {
            this.driver = await this._driverService.create(this.driver);
        }
        catch (error)
        {
            /*
            if (error instanceof ApiError && error.response != null && error.response.status === 409)
            {

                this.emailOrPhoneAlreadyExist = true
            } else {
                Log.error("Could not save the route planning settings", error);
            }

            this.updating = false;
            */
        }
    }
}
