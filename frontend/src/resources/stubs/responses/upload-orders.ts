// tslint:disable
export default
{
    "GET /api/v1/orders/upload":
    {
        delay: 1000,
        // status: 204,
        data:
        {
            "errorsByType": [
                {
                    "columnName": "Postnummer",
                    "name": "4 cifre i postnummer",
                    "rows": [
                        {
                            "rowIndex": 1,
                            "cellValue": "27000"
                        },
                        {
                            "rowIndex": 57,
                            "cellValue": "20000"
                        },
                        {
                            "rowIndex": 69,
                            "cellValue": "90000"
                        },
                        {
                            "rowIndex": 77,
                            "cellValue": "800000"
                        },
                        {
                            "rowIndex": 88,
                            "cellValue": "4436500"
                        },
                        {
                            "rowIndex": 89,
                            "cellValue": "0434600"
                        },
                        {
                            "rowIndex": 100,
                            "cellValue": "5465300"
                        }
                    ]
                },
                {
                    "columnName": "Postnummer",
                    "name": "Kun tal i et postnummer",
                    "rows": [
                        {
                            "rowIndex": 2,
                            "cellValue": "2700d"
                        },
                        {
                            "rowIndex": 5,
                            "cellValue": "270sdg0"
                        },
                        {
                            "rowIndex": 22,
                            "cellValue": "dhdf000"
                        },
                        {
                            "rowIndex": 51,
                            "cellValue": "2dh00"
                        },
                        {
                            "rowIndex": 67,
                            "cellValue": "dh70h0"
                        },
                        {
                            "rowIndex": 68,
                            "cellValue": "2dfh0"
                        },
                        {
                            "rowIndex": 99,
                            "cellValue": "27as0"
                        }
                    ]
                }
            ],
            "totalErrors": 14
        }
    },

    "POST /api/v1/upload/excel":
    {
        delay: 250,
        data:
        {
            "fileId": "ihgas978678wtkb"
        }
    },
}
