import { autoinject, bindable } from "aurelia-framework";
import { OrderTrackingSettings, AuthorityToLeaveLocation, SupportNoteLocale } from "app/model/order-tracking";

/**
 * Represents the profile view.
 */
@autoinject
export class OrganizationTrackingCustomElement
{
    /**
     * The standard locations for authority to leave.
     */
    protected readonly authorityToLeaveLocations = Object.keys(AuthorityToLeaveLocation.values).map(key => new AuthorityToLeaveLocation(key as any));

    /**
     * The locales for which a support note may be specified.
     */
    protected readonly supportNoteLocales = Object.keys(SupportNoteLocale.values).map(key => new SupportNoteLocale(key as any));

    /**
     * The selected support note locale.
     */
    protected readonly supportNoteLocale: SupportNoteLocale = this.supportNoteLocales.find(l => l.code === "en")!;

    /**
     * The tracking settings for the organization.
     */
    @bindable
    public tracking: OrderTrackingSettings | undefined;

    /**
     * True if the settings is readonly, otherwise false.
     */
    @bindable
    public readonly: boolean;
}
