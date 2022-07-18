import { Id } from "shared/utilities";
import { ApiClient } from "shared/infrastructure";
import { autoinject } from "aurelia-framework";
import { LocalStateService } from "app/services/local-state";
import { ListViewDefinition } from "../entities/list-view-definition";
import { IListViewDefinitionInit } from "../entities/list-view-definition-init";
import { ListViewFilter } from "../entities/list-view-filter";
import { ListViewType } from "../entities/list-view-type";
import { createListViewDefinition } from "../factories/list-view-definition-factory";
import { IListViews } from "../entities/list-views";

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
     * Gets all list view definitions visible to the current user.
     * @param type The type of list view definitions to get.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the list view definitions.
     */
    public async getAll<TFilter extends ListViewFilter>(type: ListViewType, signal?: AbortSignal): Promise<IListViews<TFilter>>
    {
        const result = await this._apiClient.get("views",
        {
            query: { type },
            signal
        });

        const sharedListViewDefinitions = result.data.map(data =>
            createListViewDefinition(this.fromLegacy({ ...data, shared: true })));

        sharedListViewDefinitions.sort((a, b) => a.name.localeCompare(b.name));

        const personalListViewDefinitions = this._localStateService.get().listViews?.[type]?.map(data =>
            createListViewDefinition(this.fromLegacy({ ...data, shared: false }))) ?? [];

        personalListViewDefinitions.sort((a, b) => a.name.localeCompare(b.name));

        return { shared: sharedListViewDefinitions, personal: personalListViewDefinitions };
    }

    /**
     * Creates the specified list view definition.
     * @param listViewDefinition The list view definition to create.
     * @returns A promise that will be resolved with the created list view.
     */
    public async create<TFilter extends ListViewFilter>(listViewDefinition: ListViewDefinition<TFilter>): Promise<ListViewDefinition<TFilter>>
    {
        if (listViewDefinition.shared)
        {
            const result = await this._apiClient.post("views/create",
            {
                body: this.toLegacy(listViewDefinition)
            });

            return createListViewDefinition(this.fromLegacy({ ...result.data, shared: true }));
        }

        listViewDefinition.id = Id.uuid(1);

        this._localStateService.mutate(state =>
        {
            if (state.listViews == null)
            {
                state.listViews = {};
            }

            const personalListViewDefinitions = state.listViews[listViewDefinition.type] ?? [];

            personalListViewDefinitions.push(this.toLegacy(listViewDefinition));

            state.listViews[listViewDefinition.type] = personalListViewDefinitions;
        });

        return createListViewDefinition(listViewDefinition);
    }

    /**
     * Deletes the specified list view definition.
     * @param listViewDefinition The list view definition to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    public async delete(listViewDefinition: ListViewDefinition<any>): Promise<void>
    {
        if (listViewDefinition.shared)
        {
            await this._apiClient.post(`views/${listViewDefinition.id}/delete`,
            {
                body: { type: listViewDefinition.type }
            });
        }

        this._localStateService.mutate(state =>
        {
            if (state.listViews == null)
            {
                state.listViews = {};
            }

            const personalListViewDefinitions = state.listViews[listViewDefinition.type] ?? [];

            const index = personalListViewDefinitions.findIndex(lvd => lvd.id === listViewDefinition.id);

            if (index > -1)
            {
                personalListViewDefinitions.splice(index, 1);

                state.listViews[listViewDefinition.type] = personalListViewDefinitions;
            }
        });
    }

    private toLegacy(listViewDefinition: ListViewDefinition<any> | IListViewDefinitionInit<any>): any
    {
        const data =
        {
            id: (listViewDefinition as ListViewDefinition<any>).id,
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
        const data =
        {
            id: legacyListViewDefinition.id,
            type: legacyListViewDefinition.type,
            name: legacyListViewDefinition.name,
            shared: legacyListViewDefinition.shared,
            sorting: legacyListViewDefinition.state.sorting,
            filter: legacyListViewDefinition.state.filter,
            columns: legacyListViewDefinition.state.columns.map(text =>
            {
                const [slug, width] = text.split("|");

                return { slug, width };
            })
        };

        return data;
    }
}
