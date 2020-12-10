import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to files.
 */
export class FilesModule extends AppModule
{
    public configure(): void
    {
        /**
         * Creates a route from a template.
         * @returns The ID and slug of the new route.
         */
        this.router.post("/v2/files/upload", async context =>
        {
            context.authorize();

            const routesResult = await this.apiClient.post("files/upload",
            {
                body:
                {
                    ...context.request.body
                }
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
