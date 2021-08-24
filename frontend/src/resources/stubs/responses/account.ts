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
                nationalNumber: "42424242",
                countryCallingCode: "45",
                countryCode: "DK"
            },
            fullName: "John Doe",
            preferredName: "John",
            pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200"
        }
    },

    "PUT /api/v2/account/profile":
    {
        body:
        {
            email: "john-doe@example.com",
            phone:
            {
                nationalNumber: "42424242",
                countryCallingCode: "45",
                countryCode: "DK"
            },
            fullName: "John Doe",
            preferredName: "John",
            pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200"
        }
    },

    "POST /api/v2/account/create":
    {
        body:
        {
            email: "john-doe@example.com",
            fullName: "John Doe",
            preferredName: "John",
            pictureUrl: "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4?s=200"
        }
    }
}
