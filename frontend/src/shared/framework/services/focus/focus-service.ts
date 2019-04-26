import { singleton } from "aurelia-framework";
import { EventManager } from "shared/utilities";

// The class name added to the `body` element during keyboard navigation.
const focusVisibleClassName = "focus-visible";

/**
 * Represents the extended options that may be passed to the standard `focus` method,
 * to control how focus visibility is affected.
 */
export interface IExtendedFocusOptions extends FocusOptions
{
    /**
     * True to make the focus visible, false to make it invisible,
     * or undefined to keep the current visibility.
     * Default is undefined.
     */
    focusVisible?: boolean;
}

/**
 * Represents a service that manages the visibility of focus, by adding a
 * class to the `body` element when keyboard navigation occurs, and removing
 * it when any mouse, touch or pointer interaction occurs.
 * Note that this only manages the class; styling must be provided separately.
 */
@singleton()
export class FocusService
{
    /**
     * Creates a new instance of the type.
     */
    public constructor()
    {
        // Hide keyboard focus when any mouse, touch or pointer event occurs.
        this._eventManager.addEventListener(document, ["mousedown", "touchstart", "pointerdown"], () =>
        {
            this.focusVisible = false;
        },
        { capture: true });

        // Show keyboard focus when the `Tab` key is pressed.
        this._eventManager.addEventListener(document, "keydown", (event: KeyboardEvent) =>
        {
            if (event.key === "Tab" && !event.ctrlKey && !event.altKey && !event.metaKey && !event.defaultPrevented)
            {
                this.focusVisible = true;
            }
        });

        // Optionally show or hide focus when set programatically.
        // tslint:disable: no-invalid-this no-unbound-method no-this-assignment
        const focusService = this;
        const focusFunc = HTMLElement.prototype.focus;
        HTMLElement.prototype.focus = function(options?: IExtendedFocusOptions): void
        {
            if (options != null && options.focusVisible != null)
            {
                focusService.focusVisible = options.focusVisible;
            }

            focusFunc.apply(this, arguments as any);
        };
        // tslint:enable
    }

    private readonly _eventManager = new EventManager(this);
    private _focusVisible = false;

    /**
     * True to enable automatic focus management, otherwise false.
     * The default is true.
     */
    public enabled = true;

    /**
     * True if focus is visible, otherwise false.
     */
    public get focusVisible(): boolean
    {
        return this._focusVisible;
    }

    /**
     * Sets whether focus should be visible.
     * Note that this can be set regardless of whether the service is enabled or disabled.
     * @param value True if focus should be visible, otherwise false.
     */
    public set focusVisible(value: boolean)
    {
        this._focusVisible = value;

        if (value)
        {
            document.body.classList.add(focusVisibleClassName);
        }
        else
        {
            document.body.classList.remove(focusVisibleClassName);
        }
    }
}
