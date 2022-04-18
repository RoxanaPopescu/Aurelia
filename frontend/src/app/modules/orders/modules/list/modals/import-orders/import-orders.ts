import { autoinject, computedFrom } from "aurelia-framework";
import { DropzoneFile, DropzoneOptions } from "dropzone";
import { ISorting } from "shared/types";
import { Id, getPropertyValue } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal, ToastService } from "shared/framework";
import { OrderService } from "app/model/order";
import successToast from "./resources/strings/success-toast.json";

/**
 * Represents the module.
 */
@autoinject
export class ImportOrdersPanel
{
    /**
     * Creates a new instance of the class.
     * @param modal The `Modal` instance.
     * @param toastService The `ToastService` instance.
     * @param orderService The `OrderService` instance.
     */
    public constructor(modal: Modal, toastService: ToastService, orderService: OrderService)
    {
        this._modal = modal;
        this._toastService = toastService;
        this._orderService = orderService;
    }

    private readonly _modal: Modal;
    private readonly _toastService: ToastService;
    private readonly _orderService: OrderService;

    private _dropzoneFile: DropzoneFile | undefined;
    private _dropzoneFileId: string | undefined;

    /**
     * The slug identifying the view currently being presented.
     */
    protected view: "upload" | "errors" = "upload";

    /**
     * The `Dropzone` instance.
     */
    protected dropzone: Dropzone;

    /**
     * The `Dropzone` options.
     */
    protected dropzoneOptions: DropzoneOptions =
    {
        maxFiles: 1,
        acceptedFiles: ".xlsx",
        url: () => `/api/v2/files/upload/temporary?id=${this._dropzoneFileId}`
    };

    /**
     * The errors detected in the uploaded file.
     */
    protected errors: any[] | undefined;

    /**
     * The sorting to use for the error table.
     */
    protected sorting: ISorting =
    {
        property: "range.fromRow",
        direction: "ascending"
    };

    /**
     * Gets the errors detected in the uploaded file, sorted as specified.
     */
    @computedFrom("errors.length", "sorting")
    protected get orderedErrors(): any[] | undefined
    {
        if (this.errors == null)
        {
            return undefined;
        }

        const offset = this.sorting.direction === "ascending" ? 1 : -1;

        return this.errors

            .slice()

            // Sorting
            .sort((a, b) =>
            {
                const aPropertyValue = getPropertyValue(a, this.sorting.property);
                const bPropertyValue = getPropertyValue(b, this.sorting.property);

                // Sort by selected column and direction.
                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

                return 0;
            });
    }

    /**
     * Called by the framework when the modal is attached to the DOM.
     */
    public attached(): void
    {
        this.dropzone.on("addedfile", file =>
        {
            if (this._dropzoneFile !== undefined)
            {
                this.dropzone.removeFile(this._dropzoneFile);
            }

            this._dropzoneFile = file;
            this._dropzoneFileId = Id.uuid(1);
        });

        this.dropzone.on("success", async (file, response) =>
        {
            await this.onUploadSuccess();
        });

        this.dropzone.on("error", (file, messageOrError) =>
        {
            this.reset();

            if (messageOrError.toString() === "You can't upload files of this type.")
            {
                Log.error("You can't upload files of this type.");
            }
            else
            {
                Log.error("Could not upload the file.", messageOrError);
            }
        });
    }

    /**
     * Resets the state of the panel.
     */
    public reset(): void
    {
        this.dropzone.removeAllFiles();
        this._dropzoneFile = undefined;
        this._dropzoneFileId = undefined;
        this.errors = undefined;
        this.view = "upload";
    }

    /**
     * Called when a file upload succeeds.
     * Creates the orders specified in the file.
     */
    public async onUploadSuccess(): Promise<void>
    {
        try
        {
            this._modal.busy = true;

            const result = await this._orderService.importFromFile(this._dropzoneFileId!);

            switch (result.status)
            {
                case "success":
                {
                    const toastModel =
                    {
                        heading: successToast.heading.replace("{orderCount}", result.orderCount.toString()),
                        body: successToast.body
                    };

                    this._toastService.open("success", toastModel);

                    await this._modal.close();

                    break;
                }
                case "failure":
                {
                    this.errors = result.errors.map(error => ({ ...error, fixed: false }));

                    this.view = "errors";

                    break;
                }
            }
        }
        catch (error)
        {
            Log.error("Could not import orders.", error);

            this.reset();
        }
        finally
        {
            this._modal.busy = false;
        }
    }
}
