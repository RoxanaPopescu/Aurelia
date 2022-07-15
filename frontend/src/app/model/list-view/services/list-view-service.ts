import { Id } from "shared/utilities";
import { ApiClient } from "shared/infrastructure";
import { autoinject } from "aurelia-framework";
import { LocalStateService } from "app/services/local-state";
import { ListViewDefinition } from "../entities/list-view-definition";
import { IListViewDefinitionInit } from "../entities/list-view-definition-init";
import { IListViewFilter } from "../entities/list-view-filter";
import { ListViewType } from "../entities/list-view-type";

/**
 * Represents a service that manages list views.
 */
@autoinject
export class ListViewService
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
     * Gets all list views visible to the current user.
     * @param type The type of list views to get.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the list views.
     */
    public async getAll<TFilter extends IListViewFilter>(type: ListViewType, signal?: AbortSignal): Promise<{ shared: ListViewDefinition<TFilter>[]; personal: ListViewDefinition<TFilter>[]; }>
    {
        const result = await this._apiClient.get("views",
        {
            query: { type },
            signal
        });

        const sharedListViews = result.data.map(data =>
            new ListViewDefinition(this.fromLegacy({ ...data, shared: true })));

        sharedListViews.sort((a, b) => a.name.localeCompare(b.name));

        const localListViews = this._localStateService.get().ListViews?.[type]?.map(data =>
            new ListViewDefinition(this.fromLegacy({ ...data, shared: false }))) ?? [];

        localListViews.sort((a, b) => a.name.localeCompare(b.name));

        return { shared: sharedListViews, personal: localListViews };
    }

    /**
     * Creates the specified list view.
     * @param listViewInit The data for the list view to create.
     * @returns A promise that will be resolved with the created list view.
     */
    public async create<TFilter extends IListViewFilter>(listViewInit: IListViewDefinitionInit<TFilter>): Promise<ListViewDefinition<TFilter>>
    {
        if (listViewInit.shared)
        {
            const result = await this._apiClient.post("views/create",
            {
                body: this.toLegacy(listViewInit)
            });

            return new ListViewDefinition(this.fromLegacy({ ...result.data, shared: true }));
        }

        const localListView = { ...listViewInit, id: Id.uuid(1) };

        this._localStateService.mutate(state =>
        {
            if (state.ListViews == null)
            {
                state.ListViews = {};
            }

            const localListViews = state.ListViews[listViewInit.type] ?? [];

            localListViews.push(this.toLegacy(localListView));

            state.ListViews[localListView.type] = localListViews;
        });

        return new ListViewDefinition(localListView);
    }

    /**
     * Deletes the specified list view.
     * @param ListView The list view to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(ListView: ListViewDefinition<any>): Promise<void>
    {
        if (ListView.shared)
        {
            await this._apiClient.post(`views/${ListView.id}/delete`,
            {
                body: { type: ListView.type }
            });
        }

        this._localStateService.mutate(state =>
        {
            if (state.ListViews == null)
            {
                state.ListViews = {};
            }

            const localListViews = state.ListViews[ListView.type] ?? [];

            const index = localListViews.findIndex(vp => vp.id === ListView.id);

            if (index > -1)
            {
                localListViews.splice(index, 1);

                state.ListViews[ListView.type] = localListViews;
            }
        });
    }

    private toLegacy(listViewDefinition: ListViewDefinition<any> | IListViewDefinitionInit<any>): any
    {
        var data =
        {
            id: listViewDefinition["id"],
            type: listViewDefinition.type,
            name: listViewDefinition.name,
            shared: listViewDefinition.shared,
            state:
            {
                sorting: listViewDefinition.sorting,
                filter: listViewDefinition.filter,
                columns: listViewDefinition.columns.map(column =>
                {
                    return `${column.slug}|${column.width}`;
                })
            }
        };

        return data;
    }

    private fromLegacy(legacyListViewDefinition: any): any
    {
        var data =
        {
            id: legacyListViewDefinition.id,
            type: legacyListViewDefinition.type,
            name: legacyListViewDefinition.name,
            shared: legacyListViewDefinition.shared,
            sorting: legacyListViewDefinition.state.sorting,
            filter: legacyListViewDefinition.state.filter,
            columns: legacyListViewDefinition.state.columns.map(text =>
            {
                var [slug, width] = text.split("|");

                return { slug, width };
            })
        };

        return data;
    }
}
