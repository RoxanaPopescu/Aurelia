import { ToggleCustomElement } from "../toggle";
import { customElement } from "aurelia-framework";

/**
 * Custom element representing a check toggle.
 */
@customElement("check-toggle")
export class CheckToggleCustomElement extends ToggleCustomElement
{
    /**
     * True if the toggle is a single-select toggle, otherwise false.
     */
    public readonly single = false;
}
