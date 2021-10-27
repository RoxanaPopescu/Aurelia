import { autoinject } from "aurelia-framework";
import { MapObject } from "shared/types";
import { IdentityService } from "app/services/identity";

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

    public get(): MapObject
    {
        const state = JSON.parse(localStorage.getItem("state") ?? "{}");
        const organizationId = this._identityService.identity?.organization?.id;

        const organizationState = state[organizationId ?? "undefined"] ?? {};

        return organizationState;
    }

    public set(data: MapObject): void
    {
        const state = JSON.parse(localStorage.getItem("state") ?? "{}");
        const organizationId = this._identityService.identity?.organization?.id;

        state[organizationId ?? "undefined"] = data;

        localStorage.setItem("state", JSON.stringify(state));
    }

    public mutate(func: (data: MapObject) => MapObject | void): void
    {
        const state = JSON.parse(localStorage.getItem("state") ?? "{}");
        const organizationId = this._identityService.identity?.organization?.id;

        const organizationState = state[organizationId ?? "undefined"] ?? {};
        state[organizationId ?? "undefined"] = func(organizationState) ?? organizationState;

        localStorage.setItem("state", JSON.stringify(state));
    }

    public clear(): void
    {
        const state = JSON.parse(localStorage.getItem("state") ?? "{}");
        const organizationId = this._identityService.identity?.organization?.id;

        // tslint:disable-next-line: no-dynamic-delete
        delete state[organizationId ?? "undefined"];

        localStorage.setItem("state", JSON.stringify(state));
    }
}
