import fs from "fs";
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
     * Finds, adds and configures all modules within the app.
     */
    public configure(): void
    {
        const moduleFolderPaths = globs.sync(path.join(__dirname, "**/modules/*"));

        for (const moduleFolderPath of moduleFolderPaths)
        {
            const moduleFilePath = moduleFolderPath.replace(/([^/]+)$/, "$1/$1.js");

            if (fs.existsSync(moduleFilePath))
            {
                const moduleFileInstance = require(moduleFilePath);

                // tslint:disable-next-line: no-for-in
                for (const key in moduleFileInstance)
                {
                    if (key.endsWith("Module"))
                    {
                        const moduleClass: Type<AppModule> = moduleFileInstance[key];

                        container
                            .add(moduleClass)
                            .get(moduleClass)
                            .configure();
                    }
                }
            }
        }
    }
}
