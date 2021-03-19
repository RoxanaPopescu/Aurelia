import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to communication.
 */
export class DriversModule extends AppModule
{
    public configure(): void
    {
        /**
         * Sends a message to a driver
         * @returns 200 OK if successfull
         */
        this.router.post("/v2/drivers/send-message", async context =>
        {
            context.authorize();

            const body = context.request.body;
            body.executorId = context.user?.outfitId;

            const result = await this.apiClient.post("logistics-platform/drivers/send-message",
            {
                noi: true,
                body: body
            });

            context.response.body = result.data;
            context.response.status = 200;
        });
    }
}
