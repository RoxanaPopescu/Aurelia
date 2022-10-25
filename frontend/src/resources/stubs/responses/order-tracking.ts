// tslint:disable
export default
{
    "GET /api/v2/order-tracking/settings/bf6d4bf2-49a2-44e7-9c49-489405c5776d":
    {
        body:
        {
            support:
            {
                phone: "+45 70 15 09 09",
                email: undefined,
                note:
                {
                    "en": "We are ready to answer your call from 09:00 to 20:00 on weekdays and 09:00 to 18:00 on weekends, except on public holidays."
                }
            },
            customizeDelivery: true,
            links:
            {
                orderDetailsUrlPattern: undefined,
                termsAndConditionsUrl: "https://www.ikea.com/dk/da/customer-service/terms-conditions"
            },
            authorityToLeave:
            {
                standardLocations:
                [
                    "inFrontOfTheFrontDoor",
                    "atTheBackDoor",
                    "inTheGarage",
                    "inTheCarport",
                    "onTheTerrace",
                    "inTheGardenShed"
                ],
                customLocation: true,
                customInstruction: true
            }
        }
    },
    "POST /api/v2/order-tracking/settings/bf6d4bf2-49a2-44e7-9c49-489405c5776d/save":
    {
        body:
        {
            support:
            {
                phone: "+45 70 15 09 09",
                email: undefined,
                note:
                {
                    "en": "We are ready to answer your call from 09:00 to 20:00 on weekdays and 09:00 to 18:00 on weekends, except on public holidays."
                }
            },
            customizeDelivery: true,
            links:
            {
                orderDetailsUrlPattern: undefined,
                termsAndConditionsUrl: "https://www.ikea.com/dk/da/customer-service/terms-conditions"
            },
            authorityToLeave:
            {
                standardLocations:
                [
                    "inFrontOfTheFrontDoor",
                    "atTheBackDoor",
                    "inTheGarage",
                    "inTheCarport",
                    "onTheTerrace",
                    "inTheGardenShed"
                ],
                customLocation: true,
                customInstruction: true
            }
        }
    }
}
