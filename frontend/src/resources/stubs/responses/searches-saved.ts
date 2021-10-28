// tslint:disable
export default
{
    "GET /api/v2/searches/saved":
    {
        body:
        [
            {
                id: "1",
                text: "mover",
                createdDateTime: "2019-04-20T00:00+01:00"
            },
            {
                id: "2",
                text: "artillerivej 86",
                createdDateTime: "2019-04-20T00:00+01:00"
            }
        ]
    },

    "POST /api/v2/searches/saved":
    {
        body:
        {
            id: "6",
            text: "new saved search",
            createdDateTime: "2019-04-20T00:00+01:00"
        }
    },

    "DELETE /api/v2/searches/saved/1":
    {
        status: 204
    },

    "DELETE /api/v2/searches/saved/2":
    {
        status: 204
    },

    "DELETE /api/v2/searches/saved/6":
    {
        status: 204
    }
}
