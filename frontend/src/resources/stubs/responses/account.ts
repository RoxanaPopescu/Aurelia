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
    }
}
