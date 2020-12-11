import { AppModule } from "../../app-module";
import { Stream } from "stream";

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
            // context.authorize();

            let headers = context.headers;
            delete headers.host;
            delete headers["user-agent"];

            const stream = new Stream.Writable();
            context.req.pipe(stream);

            const routesResult = await this.apiClient.post("file/uploadpublic",
            {
                body: stream,
                headers: headers
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
            // context.authorize();

            const routesResult = await this.apiClient.post("file/uploadsensitive",
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
