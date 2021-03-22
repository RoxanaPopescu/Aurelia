import { autoinject } from "aurelia-framework";
import { Log } from "shared/infrastructure";
import { IValidation, Modal, ToastService } from "shared/framework";
import { Driver, DriverService } from "app/model/driver";
import messageSentToast from "./resources/strings/message-sent-toast.json";

@autoinject
export class SendMessagePanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance.
     * @param driverService The `DriverService` instance.
     * @param toastService The `ToastService` instance.
     */

    /**
     * Called by the framework when the modal is activated.
     * @param model The route and the stop to edit or create.
     */
    public constructor(modal: Modal, driverService: DriverService, toastService: ToastService)
    {
        this._modal = modal;
        this._driverService = driverService;
        this._toastService = toastService;
    }

    private readonly _driverService: DriverService;
    private readonly _toastService: ToastService;

    private readonly _modal: Modal;
    private _result: boolean = false;

    /**
     * The model for the modal.
     */
    public model: Driver;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The title of the message
     */
    protected title: string | undefined;

    /**
     * The message to sent to the driver
     */
    protected message: string | undefined;

    /**
     * The message to sent to the driver
     */
    protected type: "push" | "sms" = "push";

    /**
     * Called by the framework when the modal is activated.
     */
    public activate(model: Driver ): void
    {
        this.model = model;
    }

    /**
     * Called by the framework when the modal is deactivated.
     * @returns The result of the modal.
     */
    public async deactivate(): Promise<boolean>
    {
        return this._result;
    }

    protected async onSendClick(): Promise<void>
    {
        this.validation.active = true;

        // Validate the form.
        if (!await this.validation.validate())
        {
            return;
        }

        try
        {
            // Mark the modal as busy.
            this._modal.busy = true;

            // Save the changes.
            await this._driverService.sendMessage(this.model, this.type, this.message!, this.title);

            // Set the result of the modal.
            this._result = true;

            // Show success toast
            const toastModel =
                {
                    heading: messageSentToast.heading,
                    body: messageSentToast.body
                        .replace("{name}", this.model.name.first)
                };

            this._toastService.open("success", toastModel);

            await this._modal.close();
        }
        catch (error)
        {
            Log.error("Could not message the driver", error);
        }
        finally
        {
            // Mark the modal as not busy.
            this._modal.busy = false;
        }
    }
}
