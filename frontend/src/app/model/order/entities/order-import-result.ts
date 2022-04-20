/**
 * Represents the status of a completed import operation.
 */
export type OrderImportStatus = "success" | "failure";

/**
 * Represents the result of a completed import operation.
 */
export type OrderImportResult = IOrderImportSuccessResult | IOrderImportFailureResult;

/**
 * Represents the result of a successful import operation.
 */
export interface IOrderImportSuccessResult
{
    /**
     * The status of the completed import operation.
     */
    status: "success";

    /**
     * The number of orders that were imported.
     */
    orderCount: number;
}

/**
 * Represents the result of a failed import operation.
 */
export interface IOrderImportFailureResult
{
    /**
     * The status of the completed import operation.
     */
    status: "failure";

    /**
     * The errors that caused the import to fail.
     */
    errors: IOrderImportError[];
}

/**
 * Represents an error associated with a failed import operation.
 */
export interface IOrderImportError
{
    /**
     * The range identifying the rows and columns related to the error, if any.
     */
    range?:
    {
        fromColumn: string,
        fromRow: number,
        toColumn: string,
        toRow: number
    },

    /**
     * The description of the error.
     */
    description: string;
}
