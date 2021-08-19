import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { ILocale, Currency } from "shared/localization";
import { ITheme } from "shared/framework";

/**
 * Represents a tab pane for managing the settings for the current user.
 */
@autoinject
export class SettingsPaneCustomElement
{
    /**
     * The supported locales.
     */
    @bindable
    protected locales: ReadonlyArray<ILocale>;

    /**
     * The selected locale.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    protected locale: ITheme;

    /**
     * The supported themes.
     */
    @bindable
    protected themes: ReadonlyArray<ITheme>;

    /**
     * The selected theme.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    protected theme: ITheme;

    /**
     * The supported currencies.
     */
    @bindable
    protected currencies: ReadonlyArray<Currency>;

    /**
     * The selected currency.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    protected currency: Currency;
}
