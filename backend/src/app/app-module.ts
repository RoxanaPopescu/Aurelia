import { ApiClient, inject } from "../shared/infrastructure";
import { AppRouter } from "./app-router";

/**
 * Represents the base class from which all app modules must inherit.
 */
@inject
export abstract class AppModule
{
    /**
     * Configures the module.
     * @param router The `KoaRouter` instance.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(router: AppRouter, apiClient: ApiClient)
    {
        this.apiClient = apiClient;
        this.router = router;
    }

    /**
     * The `ApiClient` instance.
     */
    protected apiClient: ApiClient;

    /**
     * The `AppRouter` instance.
     */
    protected router: AppRouter;

    /**
     * Configures the module.
     */
    public abstract configure(): void;
}
