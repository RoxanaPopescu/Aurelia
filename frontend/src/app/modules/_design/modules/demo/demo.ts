import { autoinject, computedFrom } from "aurelia-framework";
import { IValidation } from "shared/framework";
import { DateTime } from "luxon";

const items: any[] = [];

for (let i = 1; i <= 20; i++)
{
    items.push({ name: i === 10 ? `Option ${i}, which has a very long name` : `Option ${i}`, value: i });
}

@autoinject
export class DemoPage
{
    protected surface = "base";

    protected fontSize = "base";

    protected labelPosition = "above";

    protected validation: IValidation;

    protected filterValue: string | undefined;

    protected tags = ["Foo", "Bar", "Baz", "Qux"];
    protected tagsValue: string[] = [];

    protected items = items;

    protected minDate = DateTime.local().startOf("day");
    protected maxDate = this.minDate.plus({ year: 1 });

    protected async submit(): Promise<void>
    {
        this.validation.active = true;

        alert(`Validation result: ${await this.validation.validate()}`);
    }

    @computedFrom("items", "filterValue")
    protected get filteredItems(): any[]
    {
        if (!this.filterValue)
        {
            return this.items;
        }

        const text = this.filterValue.toLowerCase();

        return this.items.filter(i => i.name.toLowerCase().includes(text));
    }

    @computedFrom("tags", "tagsValue.length")
    protected get remainingTags(): any[]
    {
        return this.tags.filter(t => !this.tagsValue.includes(t));
    }
}
