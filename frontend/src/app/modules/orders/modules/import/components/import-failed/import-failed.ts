import { autoinject, computedFrom } from "aurelia-framework";
import { ImportOrdersService } from "../../services/import-service";

/**
 * Represents the module.
 */
@autoinject
export class ImportFailedCustomElement
{
    /**
     * Creates a new instance of the class.
     * @param importOrdersService The `ImportOrdersService` instance.
     */
    public constructor(importOrdersService: ImportOrdersService)
    {
        this._importOrdersService = importOrdersService;
    }

    private readonly _importOrdersService: ImportOrdersService;

    public currentErrorIndex: number = 0;
    public currentErrorTypeIndex: number = 0;

    /**
     * Triggers when the user pages through errors
     */
    public onErrorIndexChange(direction: "next" | "previous"): void
    {
        if (this._importOrdersService.importErrors != null)
        {
            if (direction === "next")
            {
                if (this.currentErrorIndex + 1 === this._importOrdersService.importErrors[this.currentErrorTypeIndex].rows.length)
                {
                    this.currentErrorIndex = 0;
                    this.currentErrorTypeIndex += 1;
                }
                else
                {
                    this.currentErrorIndex += 1;
                }
            }
            else if (direction === "previous")
            {
                if (this.currentErrorIndex === 0 && this.currentErrorTypeIndex !== 0)
                {
                    this.currentErrorTypeIndex -= 1;
                    this.currentErrorIndex = this._importOrdersService.importErrors[this.currentErrorTypeIndex].rows.length - 1;
                }
                else
                {
                    this.currentErrorIndex -= 1;
                }
            }
        }
    }

    /**
     * Triggers when the user pages through error types
     */
    public onErrorTypeIndexChange(direction: "next" | "previous"): void
    {
        if (this._importOrdersService.importErrors != null)
        {
            if (direction === "next" &&
                this._importOrdersService.importErrors.length > this.currentErrorIndex + 1)
            {
                this.currentErrorTypeIndex += 1;
                this.currentErrorIndex = 0;
            }
            else if (direction === "previous" &&
                     this.currentErrorTypeIndex !== 0)
            {
                this.currentErrorTypeIndex -= 1;
                this.currentErrorIndex = 0;
            }
        }
    }

    /**
     * Checks if the user is on the last error type
     */
    @computedFrom("_importOrdersService.importErrors", "currentErrorTypeIndex")
    public get lastErrorType(): boolean
    {
        if (this._importOrdersService.importErrors != null)
        {
            if (this._importOrdersService.importErrors.length === this.currentErrorTypeIndex + 1)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if the user is on the last error
     */
    @computedFrom("_importOrdersService.importErrors", "currentErrorTypeIndex", "currentErrorIndex")
    public get lastError(): boolean
    {
        if (this._importOrdersService.importErrors != null)
        {
            if (this._importOrdersService.importErrors.length === this.currentErrorTypeIndex + 1 &&
                this._importOrdersService.importErrors[this.currentErrorTypeIndex].rows.length === this.currentErrorIndex + 1)
            {
                return true;
            }
        }

        return false;
    }

    /**
     * Gets the current error column header name
     */
    @computedFrom("_importOrdersService.importErrors")
    public get currentErrorColumnHeader(): string
    {
        if (this._importOrdersService.importErrors != null)
        {
            return this._importOrdersService.importErrors[this.currentErrorTypeIndex].columnName;
        }

        return "";
    }

    /**
     * Gets the current error value
     */
    @computedFrom("_importOrdersService.importErrors")
    public get currentErrorValue(): string
    {
        if (this._importOrdersService.importErrors != null)
        {
            return this._importOrdersService.importErrors[this.currentErrorTypeIndex].rows[this.currentErrorIndex].cellValue;
        }

        return "";
    }

    /**
     * Gets the current error row index
     */
    @computedFrom("_importOrdersService.importErrors")
    public get currentErrorRowIndex(): string
    {
        if (this._importOrdersService.importErrors != null)
        {
            return this._importOrdersService.importErrors[this.currentErrorTypeIndex].rows[this.currentErrorIndex].rowIndex.toString();
        }

        return "";
    }

    /**
     * Gets the current error message to fix the error
     */
    @computedFrom("_importOrdersService.importErrors")
    public get currentErrorMessage(): string
    {
        if (this._importOrdersService.importErrors != null)
        {
            return this._importOrdersService.importErrors[this.currentErrorTypeIndex].rows[this.currentErrorIndex].message;
        }

        return "";
    }

    /**
     * Gets the current error type name
     */
    @computedFrom("_importOrdersService.importErrors")
    public get currentErrorTypeName(): string
    {
        if (this._importOrdersService.importErrors != null)
        {
            return this._importOrdersService.importErrors[this.currentErrorTypeIndex].name;
        }

        return "";
    }
}
