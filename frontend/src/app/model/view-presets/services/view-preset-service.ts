import { LocalStateService } from "app/services/local-state";
import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { Id } from "shared/utilities";
import { ViewPreset } from "../entities/view-preset";
import { IViewPresetInit } from "../entities/view-preset-init";
import { ViewPresetType } from "../entities/view-preset-type";

/**
 * Represents a service that manages view presets.
 */
@autoinject
export class ViewPresetService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     * @param localStateService The `LocalStateService` instance.
     */
    public constructor(apiClient: ApiClient, localStateService: LocalStateService)
    {
        this._apiClient = apiClient;
        this._localStateService = localStateService;
    }

    private readonly _apiClient: ApiClient;
    private readonly _localStateService: LocalStateService;

    /**
     * Gets all view presets visible to the current user.
     * @param type The type of view presets to get.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the view presets.
     */
    public async getAll(type: ViewPresetType, signal?: AbortSignal): Promise<{ shared: ViewPreset[]; local: ViewPreset[] }>
    {
        const result = await this._apiClient.get("views",
        {
            query: { type },
            signal
        });

        const sharedViewPresets = result.data.map(data =>
            new ViewPreset({ ...data, shared: true }));

        sharedViewPresets.sort((a, b) => a.name.localeCompare(b.name));

        const localViewPresets = this._localStateService.get().viewPresets?.[type]?.map(data =>
            new ViewPreset({ ...data, shared: false })) ?? [];

        localViewPresets.sort((a, b) => a.name.localeCompare(b.name));

        return { shared: sharedViewPresets, local: localViewPresets };
    }

    /**
     * Creates the specified view preset.
     * @param viewPresetInit The data for the view preset to create.
     * @returns A promise that will be resolved with the created view preset.
     */
    public async create(viewPresetInit: IViewPresetInit): Promise<ViewPreset>
    {
        if (viewPresetInit.shared)
        {
            const result = await this._apiClient.post("views/create",
            {
                body: viewPresetInit
            });

            return new ViewPreset({ ...result.data, shared: true });
        }

        const localViewPreset = { ...viewPresetInit, id: Id.uuid(1) };

        this._localStateService.mutate(state =>
        {
            if (state.viewPresets == null)
            {
                state.viewPresets = {};
            }

            const localViewPresets = state.viewPresets[viewPresetInit.type] ?? [];

            localViewPresets.push(localViewPreset);

            state.viewPresets[localViewPreset.type] = localViewPresets;
        });

        return new ViewPreset(localViewPreset);
    }

    /**
     * Deletes the specified view preset.
     * @param viewPreset The view preset to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(viewPreset: ViewPreset): Promise<void>
    {
        if (viewPreset.shared)
        {
            await this._apiClient.post(`views/${viewPreset.id}/delete`,
            {
                body: { type: viewPreset.type }
            });
        }

        this._localStateService.mutate(state =>
        {
            if (state.viewPresets == null)
            {
                state.viewPresets = {};
            }

            const localViewPresets = state.viewPresets[viewPreset.type] ?? [];

            const index = localViewPresets.findIndex(vp => vp.id === viewPreset.id);

            if (index > -1)
            {
                localViewPresets.splice(index, 1);

                state.viewPresets[viewPreset.type] = localViewPresets;
            }
        });
    }
}
