import { IAppContext } from "app/app-context";
import { ParameterizedContext } from "koa";
import Router from "koa-router";
import { Readable } from "stream";
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
        this.router.post("/v2/files/upload/public", async context =>
        {
            const body = await this.readStream(context.req);
            await this.validateLogin(context);

            const routesResult = await this.apiClient.post("file/uploadpublic",
            {
                headers:
                {
                    "content-type": context.request.headers["content-type"],
                    "content-length": context.request.headers["content-length"]
                },
                body: body
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Creates a route from a template.
         * @returns The ID and slug of the new route.
         */
        this.router.post("/v2/files/upload/sensitive", async context =>
        {
            const body = await this.readStream(context.req);
            await this.validateLogin(context);

            const routesResult = await this.apiClient.post("file/uploadsensitive",
            {
                headers:
                {
                    "content-type": context.request.headers["content-type"],
                    "content-length": context.request.headers["content-length"]
                },
                body: body
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Gets info about a public file, including its URL.
         * @returns An object representing info about the file.
         */
        this.router.get("/v2/files/public/:id", context =>
        {
            const url = `https://filestoragetestmover.blob.core.windows.net/public/${context.params.id}`;

            context.response.body = { url };
            context.response.status = 200;
        });

        /**
         * Gets info about a public file, including its temporary URL.
         * @returns An object representing info about the file.
         */
        this.router.get("/v2/files/sensitive/:id", async context =>
        {
            await this.validateLogin(context);

            const result = await this.apiClient.post("file/getsensitive",
            {
                body:
                {
                    fileName: context.params.id
                }
            });

            context.response.body = { url: result.data.url };
            context.response.status = 200;
        });
    }

    /**
     * Validates the login - works for both legacy and new login
     */
    private async validateLogin(context: ParameterizedContext<any, IAppContext & Router.IRouterParamContext<any, IAppContext>>): Promise<void>
    {
        const noiOrigin = context.request.headers["x-noi-origin"];

        if (noiOrigin === "true")
        {
            const token = context.request.headers["token"];

            await this.apiClient.get("logistics-platform/drivers/validate-login",
            {
                noi: true,
                query:
                {
                    "access-token": token
                }
            });
        }
        else
        {
            context.authorize();
        }
    }

    /**
     * Reads the specified stream into a buffer.
     * @param stream The stream to read.
     * @returns A buffer representing the data read from the stream.
     */
    private async readStream(stream: Readable): Promise<Buffer>
    {
        return new Promise<Buffer>((resolve, reject) =>
        {
            const chunks: Buffer[] = [];
            stream.on("data", chunk => chunks.push(chunk));
            stream.on("error", error => reject(error));
            stream.on("end", () => resolve(Buffer.concat(chunks)));
        });
    }
}
