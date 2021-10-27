import { autoinject } from "aurelia-framework";
import { MapObject } from "shared/types";
import { IdentityService } from "app/services/identity";

/**
 * Represents a service that manages data stored in `localStorage`,
 * associated with the current user and organization.
 */
@autoinject
export class LocalStateService
{
    /**
     * Creates a new instance of the type.
     * @param identityService The `IdentityService` instance.
     */
    public constructor(identityService: IdentityService)
    {
        this._identityService = identityService;
    }

    private readonly _identityService: IdentityService;

    /**
     * Gets the data associated with the current user and organization.
     */
    public get(): MapObject
    {
        const state = this.getState();
        const key = this.getkey();

        const organizationState = state[key] ?? {};

        return organizationState;
    }

    /**
     * Sets the data associated with the current user and organization.
     * @param data The data to associated with the current user and organization.
     */
    public set(data: MapObject): void
    {
        const state = this.getState();
        const key = this.getkey();

        state[key] = data;

        this.setState(state);
    }

    /**
     * Mutates the data associated with the current user and organization.
     * @param func A function that either mutates the current data, or returns the new data to set.
     */
    public mutate(func: (data: MapObject) => MapObject | void): void
    {
        const state = this.getState();
        const key = this.getkey();

        const organizationState = state[key] ?? {};
        state[key] = func(organizationState) ?? organizationState;

        this.setState(state);
    }

    /**
     * Clears all data associated with the current user and organization.
     */
    public clear(): void
    {
        const state = this.getState();
        const key = this.getkey();

        // tslint:disable-next-line: no-dynamic-delete
        delete state[key];

        this.setState(state);
    }

    /**
     * Gets the key for the data associated with the current user and organization.
     * @returns The key for the data associated with the current user and organization.
     */
    private getkey(): string
    {
        const userId = this._identityService.identity?.id;
        const organizationId = this._identityService.identity?.organization?.id;

        return `userId: ${userId ?? "undefined"}, organizationId: ${organizationId ?? "undefined"}`;
    }

    /**
     * Gets the state stored in local storage.
     * @returns The state object, representing the state for all users and organizations.
     */
    private getState(): MapObject
    {
        return JSON.parse(localStorage.getItem("state") ?? "{}");
    }

    /**
     * Sets the state stored in local storage.
     * @param state The state object, representing the state for all users and organizations.
     */
    private setState(state: MapObject): void
    {
        localStorage.setItem("state", JSON.stringify(state));
    }
}
