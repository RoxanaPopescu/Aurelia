
// True to enable the picture for the user, false to show fallback content.
const useUserPicture = true;

// tslint:disable
export default
{
    "POST /api/v1/identity/sign-in":
    {
        data:
        {
            username: "thomas-darling",
            fullName: "Thomas Darling",
            preferredName: "Thomas",
            pictureUrl: useUserPicture ? "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4" : undefined,
            outfit:
            {
                type: "fulfiller",
                id: "outfit-id-1",
                slug: "outfit-1",
                companyName: "Coop Mad"
            },
            roles:
            [
                "user"
            ]
        }
    },

    "POST /api/v1/identity/sign-out":
    {
    }
}
