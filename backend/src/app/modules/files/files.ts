import { IAppContext } from "app/app-context";
import { ParameterizedContext } from "koa";
import Router from "koa-router";
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
            await this.validateLogin(context);

            const routesResult = await this.apiClient.post("file/uploadpublic",
            {
                headers:
                {
                    "content-type": context.request.headers["content-type"],
                    "content-length": context.request.headers["content-length"]
                },
                body: context.req
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
            await this.validateLogin(context);

            const routesResult = await this.apiClient.post("file/uploadsensitive",
            {
                headers:
                {
                    "content-type": context.request.headers["content-type"],
                    "content-length": context.request.headers["content-length"]
                },
                body: context.req
            });

            context.response.body = routesResult.data;
            context.response.status = 200;
        });

        /**
         * Forwards a public url to a file
         * @returns forward of url
         */
        this.router.get("/v2/files/public/:id", context =>
        {
            const filePath = `https://filestoragetestmover.blob.core.windows.net/public/${context.params.id}`;

            context.redirect(filePath);
        });

        /**
         * Forwards a sensitive temporaraly url to a file
         * @returns forward of url
         */
        this.router.get("/v2/files/sensitive/:id", async context =>
        {
            await this.validateLogin(context);

            const result = await this.apiClient.post("file/getsensitive",
            {
                body:
                {
                    id: context.params.id
                }
            });

            context.redirect(result.data.uri);
        });
    }

    /**
     * Validates the login - works for both legacy and new login
     */
   private async validateLogin(
    context: ParameterizedContext<any, IAppContext & Router.IRouterParamContext<any, IAppContext>>): Promise<void>
    {
        const noiOrigin = context.request.headers["x-noi-origin"];
        if (noiOrigin != null && noiOrigin === "true")
        {
            const token = context.headers.token;

            await this.apiClient.get("logistics-platform/drivers/validate-login",
            {
                noi: true,
                query: {
                    "access-token": token
                }
            });
        }
        else
        {
            context.authorize();
        }
    }
}
