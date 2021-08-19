// tslint:disable
export default
{
    "POST /api/v2/account/confirm-email":
    {
        status: 204
    },

    "POST /api/v2/account/forgot-password":
    {
        status: 204
    },

    "POST /api/v2/account/change-password":
    {
        body:
        {
            email: "john-doe@example.com"
        }
    },

    "POST /api/v2/account/delete":
    {
        status: 204
    },

    "GET /api/v2/account/profile":
    {
        body:
        {
            email: "john-doe@example.com",
            phone:
            {
                nationalNumber: "22222222",
                countryCallingCode: "45",
                countryCode: "DK"
            },
            fullName: "John Doe",
            preferredName: "John",
            pictureUrl: undefined,
        }
    },

    "PUT /api/v2/account/profile":
    {
        body:
        {
            email: "john-doe@example.com",
            phone:
            {
                nationalNumber: "22222222",
                countryCallingCode: "45",
                countryCode: "DK"
            },
            fullName: "John Doe",
            preferredName: "John",
            pictureUrl: undefined,
        }
    }
}
