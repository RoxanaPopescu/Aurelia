/**
 * Represents the status of a completed order import operation.
 */
export type OrderImportStatus = "success" | "failure";

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
     * The status of the completed order import operation.
     */
    status: "success";

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
     * The status of the completed order import operation.
     */
    status: "failure";

    /**
     * The errors that caused the import to fail.
     */
    errors: IOrderImportError[];
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
         * The first column in the range.
         */
        fromColumn: string,

        /**
         * The first row in the range.
         */
        fromRow: number,

        /**
         * The last column in the range.
         */
        toColumn: string,

        /**
         * The last column in the range.
         */
        toRow: number
    },

    /**
     * The description of the error.
     */
    description: string;
}
