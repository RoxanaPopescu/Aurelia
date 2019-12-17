import { autoinject, computedFrom } from "aurelia-framework";
import { ImportOrdersService } from "../../services/import-service";
import { DropzoneFile, DropzoneOptions } from "dropzone";
import { Log } from "shared/infrastructure";
import { ImportService } from "app/model/import";
import { Consignor } from "app/model/outfit";
import { AgreementService } from "app/model/agreement";

/**
 * Represents the module.
 */
@autoinject
export class ImportUploadCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param importOrdersService The `ImportOrdersService` instance.
     * @param importService The `ImportService` instance.
     */
    public constructor(importOrdersService: ImportOrdersService, importService: ImportService, agreementService: AgreementService)
    {
        this._importOrdersService = importOrdersService;
        this._importService = importService;
        this._agreementService = agreementService;

        // tslint:disable-next-line: no-floating-promises
        (async () =>
        {
            // Fetch available consignors.
            const agreements = await this._agreementService.getAll();
            this.availableConsignors = agreements.agreements.filter(c => c.type.slug === "consignor");
        })();
    }

    private readonly _importOrdersService: ImportOrdersService;
    private readonly _importService: ImportService;
    private readonly _agreementService: AgreementService;
    protected availableConsignors: Consignor[];

    protected dropzone: Dropzone;
    protected dropzoneOptions: DropzoneOptions =
    {
        maxFiles: 1,
        url: "/api/v1/upload/excel",
        acceptedFiles: ".xlsx"
    };
    public file: DropzoneFile | undefined = undefined;
    public dropzoneError: "type" | "unknown" | undefined = undefined;
    public uploadComplete: boolean = false;
    public fileId: string | undefined = undefined;
    public selectedConsignor: Consignor | undefined = undefined;

    /**
     * Triggers when the dropzone element is attached
     */
    public attached(): void
    {
        this.dropzone.on("addedfile", file => this.onFileAdded(file));

        this.dropzone.on("success", (file, response) =>
        {
            // TODO: Get fileId from the response
            this.dropzoneError = undefined;
        });

        this.dropzone.on("error", (file, message) =>
        {
            if (message.toString().toLowerCase().indexOf("of this type") > -1)
            {
                this.dropzoneError = "type";
            }
            else
            {
                this.dropzoneError = "unknown";
            }
        });
    }

    /**
     * Triggers when a file is added to the dropzone element
     */
    public onFileAdded(file: DropzoneFile): void
    {
        this.dropzoneError = undefined;
        if (this.file !== undefined)
        {
            this.dropzone.removeFile(this.file);
        }
        this.file = file;
    }

    /**
     * Gets the file extension from a file in dropzone
     */
    @computedFrom("file")
    public get fileExtension(): string
    {
        if (this.file != null)
        {
            const name = this.file.name.split(".");

            return `.${name[name.length - 1]}`;
        }

        return "File not found.";
    }

    /**
     * Uploads a file and a consignorId to attach with it
     */
    public async onUploadClick(): Promise<void>
    {
        if (this.fileId !== undefined && this.selectedConsignor !== undefined)
        {
            try
            {
                const response = await this._importService.createOrdersFromFile(this.fileId, this.selectedConsignor.id);
                if (response.response.status === 204)
                {
                    this.uploadComplete = true;
                }
                else
                {
                    this._importOrdersService.importErrors = response.data;
                    this._importOrdersService.currentPage = "failed";
                }
            }
            catch (error)
            {
                Log.error("File upload failed", error);
            }
        }
    }
}
