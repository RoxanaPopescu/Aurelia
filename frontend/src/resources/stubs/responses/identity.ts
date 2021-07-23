
// tslint:disable
export default
{
    "POST /api/v2/identity/authenticate":
    {
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Nxi7gTO1CwfDVMp6ub9-L3RZb3GVRDN49vxzh-gntuk",
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Nxi7gTO1CwfDVMp6ub9-L3RZb3GVRDN49vxzh-gntuk"
    },

    "POST /api/v2/identity/authorize":
    {
        status: 204
    },

    "POST /api/v2/identity/reauthorize":
    {
        // Uncomment if reauthorization should fail.
        // status: 401

        // Uncomment if reauthorization should succeed.
        refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Nxi7gTO1CwfDVMp6ub9-L3RZb3GVRDN49vxzh-gntuk",
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Nxi7gTO1CwfDVMp6ub9-L3RZb3GVRDN49vxzh-gntuk"
    },

    "POST /api/v2/identity/unauthenticate":
    {
        status: 204
    }
}
