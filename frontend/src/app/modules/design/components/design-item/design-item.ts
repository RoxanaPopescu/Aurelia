import { bindable } from "aurelia-framework";

export class DesignItem
{
    protected expanded = true;

    @bindable
    public heading?: string;
}
