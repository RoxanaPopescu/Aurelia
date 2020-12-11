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
        this.router.post("/v2/files/upload-public", async context =>
        {
            context.authorize();

            const routesResult = await this.apiClient.post("file/uploadpublic",
            {
                body:
                {
                    ...context.request.body
                },
                headers: context.headers
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route from a template.
         * @returns The ID and slug of the new route.
         */
        this.router.post("/v2/files/upload-sensitive", async context =>
        {
            context.authorize();

            const routesResult = await this.apiClient.post("file/uploadsensitive",
            {
                body:
                {
                    ...context.request.body
                },
                headers: context.headers
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });
    }
}
