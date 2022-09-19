import { autoinject } from "aurelia-framework";
import { ApiClient } from "shared/infrastructure";
import { AutoContractorAssignmentRule } from "../entities/auto-contractor-assignment-rule";
import { AutoContractorAssignmentSettings } from "../entities/auto-contractor-assignment-settings";

/**
 * Represents a service that manages auto contractor assignment settings.
 */
@autoinject
export class AutoContractorAssignmentService
{
    /**
     * Creates a new instance of the type.
     * @param apiClient The `ApiClient` instance.
     */
    public constructor(apiClient: ApiClient)
    {
        this._apiClient = apiClient;
    }

    private readonly _apiClient: ApiClient;

    /**
     * Gets the auto contractor assignment settings associated with the organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the auto contractor assignment settings.
     */
    public async get(signal?: AbortSignal): Promise<AutoContractorAssignmentSettings>
    {
        const rules = await this.getRules(signal);

        return new AutoContractorAssignmentSettings(rules);
    }

    /**
     * Updates the specified auto contractor assignment settings.
     * @param settings The auto contractor assignment settings to save.
     * @returns A promise that will be resolved with the auto contractor assignment settings.
     */
    public async update(settings: AutoContractorAssignmentSettings): Promise<AutoContractorAssignmentSettings>
    {
        const ruleUpdateInfos = settings.rules.map((r, i) =>
        ({
            index: i,
            rule: r,
            promise:
                r.id == null ? this.createRule(r) :
                r.hasChanges ? this.updateRule(r) :
                undefined
        }));

        const updatePromises = ruleUpdateInfos.map(r => r.promise);
        const deletePromises = settings.deletedRules.map(rule => this.deleteRule(rule.id));

        await Promise.all([...updatePromises, ...deletePromises]);

        const updatedRules = await Promise.all(ruleUpdateInfos.map(o => o.promise ?? o.rule));

        return new AutoContractorAssignmentSettings(updatedRules);
    }

    /**
     * Gets the auto contractor assignment rules associated with the organization.
     * @param signal The abort signal to use, or undefined to use no abort signal.
     * @returns A promise that will be resolved with the auto contractor assignment rules.
     */
    private async getRules(signal?: AbortSignal): Promise<AutoContractorAssignmentRule[]>
    {
        const result = await this._apiClient.get("dispatch/route/automatic-contractor/list",
        {
            signal
        });

        return result.data.map(data => new AutoContractorAssignmentRule(data));
    }

    /**
     * Creates the specified auto contractor assignment rules.
     * @param rule The auto contractor assignment rule to create.
     * @returns A promise that will be resolved with the auto contractor assignment rule.
     */
    private async createRule(settings: AutoContractorAssignmentRule): Promise<AutoContractorAssignmentRule>
    {
        const result = await this._apiClient.post("dispatch/route/automatic-contractor/create",
        {
            body: settings
        });

        return new AutoContractorAssignmentRule(result.data);
    }

    /**
     * Updates the specified auto contractor assignment rules.
     * @param rule The auto contractor assignment rule to update.
     * @returns A promise that will be resolved with the auto contractor assignment rule.
     */
    private async updateRule(settings: AutoContractorAssignmentRule): Promise<AutoContractorAssignmentRule>
    {
        const result = await this._apiClient.post("dispatch/route/automatic-contractor/update",
        {
            body: settings
        });

        return new AutoContractorAssignmentRule(result.data);
    }

    /**
     * Deletes the specified auto contractor assignment rule.
     * @param id The ID of the auto contractor assignment rule to delete.
     * @returns A promise that will be resolved when the operation succeedes.
     */
    private async deleteRule(id: string): Promise<void>
    {
        await this._apiClient.post("dispatch/route/automatic-contractor/delete",
        {
            body: { ruleId: id }
        });
    }
}
