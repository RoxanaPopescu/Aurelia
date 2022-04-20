const useSheetName = false;

const successResponse =
{
    delay: 2000,
    body:
    {
        status: "success",
        orderCount: 123
    }
};

const failureResponse =
{
    delay: 2000,
    body:
    {
        status: "failure",
        errors:
        [
            ...useSheetName ?
            [
                {
                    range:
                    {
                        sheetName: "Sheet name 2",
                        fromColumn: "A",
                        fromRow: 2,
                        toColumn: "A",
                        toRow: 2
                    },
                    description: "Expected order ID to not already exist."
                }
            ]
            :
            [
                {
                    range: undefined,
                    description: "Expected file to contain only one sheet."
                }
            ],
            {
                range:
                {
                    sheetName: useSheetName ? "Sheet name 1" : undefined,
                    fromColumn: "A",
                    fromRow: 2,
                    toColumn: "A",
                    toRow: 2
                },
                description: "Expected order ID to not already exist."
            },
            {
                range:
                {
                    sheetName: useSheetName ? "Sheet name 1" : undefined,
                    fromColumn: "A",
                    fromRow: 6,
                    toColumn: "A",
                    toRow: 52
                },
                description: "Expected order ID to be specified."
            },
            {
                range:
                {
                    sheetName: useSheetName ? "Sheet name 1" : undefined,
                    fromColumn: "D",
                    fromRow: 27,
                    toColumn: "D",
                    toRow: 27
                },
                description: "Expected estimated colli to be a whole number."
            },
            {
                range:
                {
                    sheetName: useSheetName ? "Sheet name 1" : undefined,
                    fromColumn: "E",
                    fromRow: 27,
                    toColumn: "E",
                    toRow: 27
                },
                description: "Expected estimated weight to be a number."
            },
            {
                range:
                {
                    sheetName: useSheetName ? "Sheet name 2" : undefined,
                    fromColumn: "A",
                    fromRow: 39,
                    toColumn: "A",
                    toRow: 63
                },
                description: "Expected order ID to contain only valid characters."
            },
            {
                range:
                {
                    sheetName: useSheetName ? "Sheet name 2" : undefined,
                    fromColumn: "E",
                    fromRow: 38,
                    toColumn: "E",
                    toRow: 38
                },
                description: "Expected estimated weight to be a number."
            }
        ]
    }
};

let success = true;

// tslint:disable
export default
{
    "POST /api/v2/orders/import-from-file": () =>
    {
        // For demo purposes, alternate between success and failure.
        success = !success;

        return success ? successResponse : failureResponse;
    }

}
