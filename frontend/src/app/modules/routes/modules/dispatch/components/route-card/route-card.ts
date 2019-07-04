import { bindable } from "aurelia-framework";
import { AccentColor } from "resources/styles";

export class RouteCardCustomElement
{
    @bindable
    public accent: AccentColor;
}
