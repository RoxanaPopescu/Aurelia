
// True to enable the picture for the user, false to show fallback content.
const useUserPicture = true;

const identity =
{
    id: "user-id",
    email: "mail@thda.dk",
    fullName: "Thomas Darling",
    preferredName: "Thomas",
    pictureUrl: useUserPicture ? "https://www.gravatar.com/avatar/db94528473d63829a2f0ea8c274ac6b4" : undefined
};

// tslint:disable
export default
{
    "POST /api/v1/identity/authenticate":
    {
        body: identity

    },

    "POST /api/v1/identity/reauthenticate":
    {
        // Uncomment if reauthentication should fail.
        // status: 401

        // Uncomment if reauthentication should succeed.
        body: identity
    },

    "POST /api/v1/identity/authorize":
    {
        status: 204
    },

    "POST /api/v1/identity/unauthenticate":
    {
        status: 204
    }
}
