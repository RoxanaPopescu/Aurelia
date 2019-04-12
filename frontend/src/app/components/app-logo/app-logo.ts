import { autoinject, bindable } from "aurelia-framework";
import { ModalService } from "shared/framework";

/**
 * Represents the logo for the app, which opens the `dashboard` overlay when clicked.
 */
@autoinject
export class AppLogoCustomElement
{
    /**
     * Creates a new instance of the type.
     * @param modalService The `ModalService` instance.
     */
    public constructor(modalService: ModalService)
    {
        this._modalService = modalService;
    }

    private readonly _modalService: ModalService;

    /**
     * True to disable toggling of the dashboard, otherwise false.
     * This should only be false when presented as the landing page after sign in.
     */
    @bindable({ defaultValue: false })
    public disabled: boolean;

    /**
     * The size of the logo to show.
     */
    @bindable({ defaultValue: "icon" })
    public size: "icon" | "wide";

    /**
     * Called when the element is clicked.
     * Opens or toggles the specified modal.
     */
    protected onClick(event: MouseEvent): void
    {
        event.preventDefault();

        if (this.disabled)
        {
            return;
        }

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
