const body =
{
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Nxi7gTO1CwfDVMp6ub9-L3RZb3GVRDN49vxzh-gntuk",
    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Nxi7gTO1CwfDVMp6ub9-L3RZb3GVRDN49vxzh-gntuk",
    id: "john-doe-id",
    username: "john-doe@example.com",
    fullName: "John Doe",
    preferredName: "John",
    pictureUrl: undefined,
    outfit:
    {
        id: "outfit-1-id",
        companyName: "Foo"
    }
}

// tslint:disable
export default
{
    "POST /api/v2/identity/authenticate":
    {
        body
    },

    "POST /api/v2/identity/authorize":
    {
        body
    },

    "POST /api/v2/identity/reauthorize":
    {
        // Uncomment if reauthorization should fail.
        // status: 401

        // Uncomment if reauthorization should succeed.
        body
    },

    "POST /api/v2/identity/unauthenticate":
    {
        status: 204
    }
}
