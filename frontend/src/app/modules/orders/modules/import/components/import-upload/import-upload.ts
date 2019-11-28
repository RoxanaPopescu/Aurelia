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

    /**
     * Fill out
     */
    public attached(): void
    {
        this.dropzone.on("addedfile", file => this.onFileAdded(file));
        this.dropzone.on("success", (file, response) => console.log(file, response));
        this.dropzone.on("error", (file, message) => console.log(file, message.valueOf()));
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
