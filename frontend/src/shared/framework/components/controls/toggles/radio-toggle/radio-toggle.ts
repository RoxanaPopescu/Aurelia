import { ToggleCustomElement } from "../toggle";
import { customElement } from "aurelia-framework";

/**
 * Custom element representing a radio roggle.
 */
@customElement("radio-toggle")
export class RadioToggleCustomElement extends ToggleCustomElement
{
    /**
     * True if the toggle is a single-select toggle, otherwise false.
     */
    public readonly single = true;
}
