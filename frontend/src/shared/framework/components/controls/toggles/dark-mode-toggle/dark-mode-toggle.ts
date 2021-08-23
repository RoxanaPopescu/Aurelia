import { ToggleCustomElement } from "../toggle";
import { customElement } from "aurelia-framework";

/**
 * Custom element representing a switch toggle for enabling or disabling dark-mode.
 */
@customElement("dark-mode-toggle")
export class DarkModeToggleCustomElement extends ToggleCustomElement
{
    /**
     * True if the toggle is a single-select toggle, otherwise false.
     */
    public readonly single = false;
}
