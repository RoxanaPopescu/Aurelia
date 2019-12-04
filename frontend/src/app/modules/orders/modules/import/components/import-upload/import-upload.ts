import { autoinject, bindable } from "aurelia-framework";
import { ImportService } from "../../services/import-service";
import { DropzoneFile, DropzoneOptions } from "dropzone";

/**
 * Represents the module.
 */
@autoinject
export class ImportUploadCustomElement
{
    @bindable protected service: ImportService;

    protected dropzone: Dropzone;
    protected dropzoneOptions: DropzoneOptions =
    {
        maxFiles: 1,
        url: "/upload",
        acceptedFiles: ".xlsx"
    };
    public file: DropzoneFile | undefined = undefined;
    public error: boolean = false;

    /**
     * Fill out
     */
    public attached(): void
    {
        this.dropzone.on("addedfile", file => this.onFileAdded(file));
        this.dropzone.on("success", (file, response, hej) =>
        {
            console.log("success", file);
            console.log("success", response);
            console.log("success", hej);
            this.error = false;
        });
        this.dropzone.on("error", (file, message) =>
        {
            console.log("error", file, message.toString());
            this.error = true;
        });
    }

    /**
     * Fill out
     */
    public onFileAdded(file: DropzoneFile): void
    {
        if (this.file !== undefined)
        {
            this.dropzone.removeFile(this.file);
        }
        this.file = file;
    }
}
