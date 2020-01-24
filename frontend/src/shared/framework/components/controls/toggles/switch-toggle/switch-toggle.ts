import { ToggleCustomElement } from "../toggle";
import { customElement } from "aurelia-framework";

/**
 * Custom element representing a switch toggle.
 */
@customElement("switch-toggle")
export class SwitchToggleCustomElement extends ToggleCustomElement
{
    /**
     * True if the toggle is a single-select toggle, otherwise false.
     */
    public readonly single = false;
}
