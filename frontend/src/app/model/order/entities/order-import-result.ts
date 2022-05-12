/**
 * Represents the result of a completed order import operation.
 */
export type OrderImportResult = IOrderImportSuccessResult | IOrderImportFailureResult;

/**
 * Represents the result of a successful order import operation.
 */
export interface IOrderImportSuccessResult
{
    /**
     * True if the import succeeded, otherwise false.
     */
    success: true;

    /**
     * The number of orders that were imported.
     */
    orderCount: number;
}

/**
 * Represents the result of a failed order import operation.
 */
export interface IOrderImportFailureResult
{
    /**
     * True if the import succeeded, otherwise false.
     */
    success: false;

    /**
     * The validation errors that caused the import to fail.
     */
    validationErrors: IOrderImportError[];
}

/**
 * Represents an error associated with a failed order import operation.
 */
export interface IOrderImportError
{
    /**
     * The range identifying the cells related to the error, if any.
     */
    range?:
    {
        /**
         * The name of the sheet, if relevant.
         */
        sheetName?: string;

        /**
         * The first column in the range.
         */
        fromColumn: string;

        /**
         * The first row in the range.
         */
        fromRow: number;

        /**
         * The last column in the range.
         */
        toColumn: string;

        /**
         * The last column in the range.
         */
        toRow: number;
    };

    /**
     * The description of the error.
     */
    description: string;
}
