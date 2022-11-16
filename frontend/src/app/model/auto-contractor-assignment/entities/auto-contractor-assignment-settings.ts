import { DataColorIndex } from "resources/styles";
import { AutoContractorAssignmentRule } from "./auto-contractor-assignment-rule";

export class AutoContractorAssignmentSettings
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(rules?: AutoContractorAssignmentRule[])
    {
        this.rules = rules ?? [];
        this.deletedRules = [];

        this.rules.sort((a, b) => a.label.localeCompare(b.label));
        this.rules.forEach((r, i) => r.color = r.color ?? (i % 8) + 1 as DataColorIndex);
    }

    public rules: AutoContractorAssignmentRule[];

    public deletedRules: AutoContractorAssignmentRule[];
}
