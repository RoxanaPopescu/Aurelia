import { autoinject, computedFrom } from "aurelia-framework";
import { DropzoneFile, DropzoneOptions } from "dropzone";
import { ISorting } from "shared/types";
import { delay, getPropertyValue } from "shared/utilities";
import { Log } from "shared/infrastructure";
import { Modal, ToastService } from "shared/framework";
import { OrderService, IOrderImportError } from "app/model/order";
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
        this.modal = modal;
        this._toastService = toastService;
        this._orderService = orderService;
    }

    private readonly _toastService: ToastService;
    private readonly _orderService: OrderService;

    /**
     * The `Modal` instance.
     */
    protected readonly modal: Modal;

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
        acceptedFiles: ".xlsx",
        autoProcessQueue: false,
        url: "irrelevant"
    };

    /**
     * The errors detected in the uploaded file.
     */
    protected errors: IOrderImportError[] | undefined;

    /**
     * The sorting to use for the error table.
     */
    protected sorting: ISorting;

    /**
     * Gets the errors detected in the uploaded file, sorted as specified.
     */
    @computedFrom("errors.length")
    protected get hasSheetName(): boolean
    {
        return this.errors?.some(error => error.range?.sheetName != null) ?? false;
    }

    /**
     * Gets the errors detected in the uploaded file, sorted as specified.
     */
    @computedFrom("errors.length", "sorting")
    protected get orderedErrors(): IOrderImportError[] | undefined
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
                // Sort errors without a range before errors with a range.
                if (a.range == null && b.range != null) { return -1; }
                if (a.range != null && b.range == null) { return 1; }

                // Sort by selected column and direction.

                const aPropertyValue = getPropertyValue(a, this.sorting.property);
                const bPropertyValue = getPropertyValue(b, this.sorting.property);

                if (aPropertyValue < bPropertyValue) { return -offset; }
                if (aPropertyValue > bPropertyValue) { return offset; }

                // Sort by additional properties.

                if (this.sorting.property !== "range.sheetName")
                {
                    // Sort by ascending `sheetName`.
                    if ((a.range!.sheetName ?? "") < (b.range!.sheetName ?? "")) { return -1; }
                    if ((a.range!.sheetName ?? "") > (b.range!.sheetName ?? "")) { return 1; }
                }

                if (this.sorting.property !== "range.fromRow")
                {
                    // Sort by ascending `fromRow`.
                    if (a.range!.fromRow < b.range!.fromRow) { return -1; }
                    if (a.range!.fromRow > b.range!.fromRow) { return 1; }
                }

                if (this.sorting.property !== "range.toRow")
                {
                    // Sort by descending `toRow`.
                    if (a.range!.toRow < b.range!.toRow) { return 1; }
                    if (a.range!.toRow > b.range!.toRow) { return -1; }
                }

                if (this.sorting.property !== "range.fromColumn")
                {
                    // Sort by ascending `fromColumn`.
                    if (a.range!.fromColumn < b.range!.fromColumn) { return -1; }
                    if (a.range!.fromColumn > b.range!.fromColumn) { return 1; }
                }

                if (this.sorting.property !== "range.toColumn")
                {
                    // Sort by descending `toColumn`.
                    if (a.range!.toColumn < b.range!.toColumn) { return 1; }
                    if (a.range!.toColumn > b.range!.toColumn) { return -1; }
                }

                if (this.sorting.property !== "description")
                {
                    // Sort by ascending `description`.
                    if (a.description < b.description) { return -1; }
                    if (a.description > b.description) { return 1; }
                }

                return 0;
            });
    }

    /**
     * Called by the framework when the modal is attached to the DOM.
     */
    public attached(): void
    {
        this.dropzone.on("error", async (file, error) =>
        {
            if (error.toString() === "You can't upload files of this type.")
            {
                Log.error("You can't upload files of this type.");
            }
            else
            {
                Log.error("Could not upload the file.", error);
            }

            // Allow the files to briefly appear in the dropzone, then reset.
            await delay(200);
            this.reset();
        });

        this.dropzone.on("addedfiles", async (files: DropzoneFile[]) =>
        {
            if (files.length !== 1)
            {
                Log.error("You can't upload multiple files at the same time.");

                // Allow the files to briefly appear in the dropzone, then reset.
                await delay(200);
                this.reset();
            }
            else
            {
                // Verify that the file is acceptable.
                // This is needed because the `error` callback is called too late.
                this.dropzone.accept(files[0], async error =>
                {
                    if (!error)
                    {
                        await this.importOrders(files[0]);

                        this.dropzone.removeAllFiles();
                    }
                });
            }
        });
    }

    /**
     * Resets the state of the panel.
     */
    public reset(): void
    {
        this.dropzone.removeAllFiles();
        this.errors = undefined;
        this.view = "upload";
    }

    /**
     * Called when a file is added to the dropzone.
     * Uploads the file and creates the orders specified in the file.
     */
    public async importOrders(file: File): Promise<void>
    {
        try
        {
            this.modal.busy = true;

            const result = await this._orderService.importFromFile(file);

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

                    await this.modal.close();

                    break;
                }
                case "failure":
                {
                    this.errors = result.errors.map(error => ({ ...error, fixed: false }));

                    this.sorting =
                    {
                        property: this.hasSheetName ? "range.sheetName" : "range.fromRow",
                        direction: "ascending"
                    };

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
            this.modal.busy = false;
        }
    }
}
