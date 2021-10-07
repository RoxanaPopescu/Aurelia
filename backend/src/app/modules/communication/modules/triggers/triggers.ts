import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to communication.
 */
export class TriggersModule extends AppModule
{
    public configure(): void
    {
        /**
         * Missing
         * @returns The phone number and message to send
         */
        this.router.post("/v2/communication/triggers", async context =>
        {
            const requestBody = context.request.body;
            let to = requestBody.phone.nationalNumber;

            if (requestBody.phone.countryCallingCode != null)
            {
                to = `${requestBody.phone.countryCallingCode}${to}`;
            }

            const routesResult = await this.apiClient.post("communication/sms/Send",
            {
                body:
                {
                    "to": to,
                    "message":
                    {
                      "from": "Mover",
                      "content": requestBody.message
                    },
                    "isSimulation": false
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
