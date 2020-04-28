import { autoinject, observable } from "aurelia-framework";
import { DriverService, Driver } from "app/model/driver";
import { IValidation } from "shared/framework";
import { DateTime } from "luxon";
import { Uuid } from "shared/utilities/id/uuid";
import { ApiError } from "shared/infrastructure";

type Result = {
    driver: Driver,
    id: string,
    created: DateTime,
    failed: "no" | "unknown-error" | "email-or-phone-already-exist"
};

/**
 * Represents the module.
 */
@autoinject
export class CreateMultiplePage
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
     * The results of created routes.
     */
    @observable
    protected results: Result[] = [];

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The route planning rule set.
     */
    protected driver: Driver;

    /**
     * The route planning rule set.
     */
    protected firstNameFocus: boolean = false;

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
     * Called when the "Transfer driver" is clicked when a creation has failed.
     */
    protected async onTransferClick(driver: Driver)
    {
        this.driver = driver;
    }

    /**
     * Called when the "Save changes" or "Create rule set" button is clicked.
     * Saves the route planning settings.
     */
    protected async onCreateClick(): Promise<void>
    {
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        const id = Uuid.v1();
        const currentDriver = this.driver;
        const result: Result = {
            failed: "no",
            created: DateTime.local(),
            id: id,
            driver: currentDriver
        }
        this.results.unshift(result);

        // Prepare for the next one
        this.driver = new Driver();
        this.firstNameFocus = true;

        try
        {
            const driver = await this._driverService.create(currentDriver);

            let index = this.results.findIndex(r => r.id === id);
            if (index >= 0) {
                this.results[index].driver = driver;
            }
        }
        catch (error)
        {
            let index = this.results.findIndex(r => r.id === id);
            if (index < 0) {
                return;
            }

            if (error instanceof ApiError && error.response != null && error.response.status === 409)
            {
                this.results[index].failed = "email-or-phone-already-exist"
            } else {
                this.results[index].failed = "unknown-error"
            }
        }
    }
}
