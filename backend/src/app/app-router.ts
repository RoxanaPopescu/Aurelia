import path from "path";
import globs from "globs";
import KoaRouter from "koa-router";
import { Type, container, inject } from "../shared/infrastructure";
import { IAppContext } from "./app-context";
import { AppModule } from "./app-module";

/**
 * Represents the app router.
 */
@inject
export class AppRouter extends KoaRouter<any, IAppContext>
{
    /**
     * Configures the instance.
     */
    public configure(): void
    {
        // Find and configure all modules in the `modules` folder.
        for (const modulePath of globs.sync(path.join(__dirname, "modules/*")))
        {
            // Load the module file.
            const moduleInstance = require(modulePath.replace(/([^/]+)$/, "$1/$1"));

            // Find exported module classes.
            for (const key in moduleInstance)
            {
                if (key.endsWith("Module"))
                {
                    // Get the module class.
                    const type: Type<AppModule> = moduleInstance[key];

                    // Add and configure the module.
                    container
                        .add(type)
                        .get(type)
                        .configure();
                }
            }
        }
    }
}
