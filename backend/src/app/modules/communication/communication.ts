import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to communication.
 */
export class CommunicationModule extends AppModule
{
    public configure(): void
    {
        /**
         * Sends a sms
         * @returns The phone number and message to send
         */
        this.router.post("/v2/communication/sms/send", async context =>
        {
            const requestBody = context.request.body;
            let to = requestBody.phone.nationalNumber;
            if (requestBody.phone.countryCallingCode != null) {
                to = `${requestBody.phone.countryCallingCode}${to}`;
            }

            const body = {
                "to": to,
                "message": {
                  "from": "Mover",
                  "content": requestBody.message
                },
                "isSimulation": false
            };


            const routesResult = await this.apiClient.post("communication/sms/Send",
            {
                body: body
            });

            context.internal();

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
