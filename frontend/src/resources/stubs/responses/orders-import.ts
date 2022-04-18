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
            {
                range:
                {
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
