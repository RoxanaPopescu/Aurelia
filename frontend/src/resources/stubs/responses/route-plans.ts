
// tslint:disable
export default
{
    "POST /api/v1/routeplanning/plans/list":
    {
      body:
      {
        "results": [
            {
                "id": "id-here",
                "status": "succeeded",
                "timeCreated": "2020-04-05T10:13:39.599Z",
                "timeCompleted": "2020-04-05T12:14:39.599Z",
                "routesCount": 3,
                "unscheduledTasksCount": 2,
                "deliveryTime": { "from": "2020-04-05T15:11:39.599Z", to: "2020-04-05T18:12:39.599Z" }
              },
              {
                "id": "id-here",
                "status": "executing",
                "timeCreated": "2020-04-05T10:13:39.599Z",
                "deliveryTime": { "from": "2020-04-05T15:11:39.599Z", to: "2020-04-05T18:12:39.599Z" }
              },
              {
                "id": "id-here",
                "status": "failed",
                "timeCreated": "2020-04-05T10:13:39.599Z",
                "deliveryTime": { "from": "2020-04-05T15:11:39.599Z", to: "2020-04-05T18:12:39.599Z" }
              }
        ],
        "hasNextPage": true,
        "hasPreviousPage": false
      }
    },
}
