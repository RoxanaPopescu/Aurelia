import { autoinject, bindable } from "aurelia-framework";
import { ModalService, ThemeService } from "shared/framework";

/**
 * Represents the logo for the app, which opens the `dashboard` overlay when clicked.
 */
@autoinject
export class AppLogoCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService` instance.
     * @param themeService The `ThemeService` instance.
     */
    public constructor(modalService: ModalService, themeService: ThemeService)
    {
        this._modalService = modalService;
        this.themeService = themeService;
    }

    private readonly _modalService: ModalService;

    /**
     * The `ThemeService` instance.
     */
    protected readonly themeService: ThemeService;

    /**
     * True if the logo is used on the account pages, otherwise false.
     */
    @bindable
    public account: boolean;

    /**
     * The size of the logo to show.
     */
    @bindable({ defaultValue: "icon" })
    public size: "icon" | "wide";

    /**
     * True to disable toggling of the `dashboard` modal, otherwise false.
     * This should only be true when presented as the landing page after sign in.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * Called when the element is clicked.
     * Toggles the `dashboard` modal.
     */
    protected onClick(): void
    {
        if (!this.disabled)
        {
            const openModals = this._modalService.find("dashboard");

            if (openModals.length > 0)
            {
                // tslint:disable-next-line: no-floating-promises
                openModals[openModals.length - 1].close();
            }
            else
            {
                this._modalService.open("dashboard");
            }
        }
    }
}
