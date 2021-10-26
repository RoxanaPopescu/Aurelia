// tslint:disable
export default
{
    "GET /api/v2/searches/recent":
    {
        body:
        [
            {
                id: "3",
                text: "mov",
                createdDateTime: "2019-04-20T00:00+01:00"
            },
            {
                id: "4",
                text: "søtorvet 5",
                createdDateTime: "2019-04-20T00:00+01:00"
            },
            {
                id: "5",
                text: "gammelager 13",
                createdDateTime: "2019-04-20T00:00+01:00"
            }
        ]
    },

    "POST /api/v2/searches/recent":
    {
        body:
        {
            id: "7",
            text: "new recent search"
        }
    }
}
