import { autoinject } from "aurelia-framework";
import { MapObject } from "shared/types";
import { IdentityService } from "app/services/identity";

export type LocalStateStorage = "session" | "local";

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
     * @param storage The type of storage to use.
     */
    public get(storage: LocalStateStorage = "local"): MapObject
    {
        const state = this.getState(storage);
        const key = this.getkey();

        const organizationState = state[key] ?? {};

        return organizationState;
    }

    /**
     * Sets the data associated with the current user and organization.
     * @param data The data to associated with the current user and organization.
     * @param storage The type of storage to use.
     */
    public set(data: MapObject, storage: LocalStateStorage = "local"): void
    {
        const state = this.getState(storage);
        const key = this.getkey();

        state[key] = data;

        this.setState(state, storage);
    }

    /**
     * Mutates the data associated with the current user and organization.
     * @param func A function that either mutates the current data, or returns the new data to set.
     * @param storage The type of storage to use.
     */
    public mutate(func: (data: MapObject) => MapObject | void, storage: LocalStateStorage = "local"): void
    {
        const state = this.getState(storage);
        const key = this.getkey();

        const organizationState = state[key] ?? {};
        state[key] = func(organizationState) ?? organizationState;

        this.setState(state, storage);
    }

    /**
     * Clears all data associated with the current user and organization.
     * @param storage The type of storage to use.
     */
    public clear(storage: LocalStateStorage = "local"): void
    {
        const state = this.getState(storage);
        const key = this.getkey();

        // tslint:disable-next-line: no-dynamic-delete
        delete state[key];

        this.setState(state, storage);
    }

    /**
     * Gets the key for the data associated with the current user and organization.
     * @returns The key for the data associated with the current user and organization.
     */
    private getkey(): string
    {
        const userId = this._identityService.identity?.id;
        const organizationId = this._identityService.identity?.organization?.id;

        return `userId: ${userId}, organizationId: ${organizationId}`;
    }

    /**
     * Gets the state stored in local storage.
     * @param storage The type of storage to use.
     * @returns The state object, representing the state for all users and organizations.
     */
    private getState(storage: LocalStateStorage): MapObject
    {
        return JSON.parse(window[`${storage}Storage`].getItem("state") ?? "{}");
    }

    /**
     * Sets the state stored in local storage.
     * @param state The state object, representing the state for all users and organizations.
     * @param storage The type of storage to use.
     */
    private setState(state: MapObject, storage: LocalStateStorage): void
    {
        window[`${storage}Storage`].setItem("state", JSON.stringify(state));
    }
}
