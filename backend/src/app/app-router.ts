import path from "path";
import globs from "globs";
import KoaRouter from "koa-router";
import { ApiClient, inject } from "../shared/infrastructure";
import { IAppContext } from "./app-context";

/**
 * Represents the app router.
 */
@inject
export class AppRouter extends KoaRouter<any, IAppContext>
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        super();

        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Configures the instance.
     */
    public configure(): void
    {
        // Find all modules in the `modules` folder.
        for (const modulePath of globs.sync(path.join(__dirname, "modules/*")))
        {
            // Load the module.
            const moduleInstance = require(modulePath.replace(/([^/]+)$/, "$1/$1"));

            // Configure the module, if it exports a `configure` method.
            if (moduleInstance.configure instanceof Function)
            {
                moduleInstance.configure(this, this._apiClient);
            }
        }
    }
}
