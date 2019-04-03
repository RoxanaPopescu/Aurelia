// tslint:disable: ban-comma-operator no-parameter-reassignment no-unnecessary-callback-wrapper

import { autoinject } from "aurelia-framework";

@autoinject
export class PaletteModule
{
    public attached(): void
    {
        document.querySelectorAll(".app-modules-design-modules-palette .colors article").forEach(element =>
        {
            const style = getComputedStyle(element);
            const color = style.getPropertyValue("background-color");
            const rgb = color.match(/\d+/g)!.map(value => parseInt(value));
            const hsl = this.rgbToHsl(rgb[0], rgb[1], rgb[2]);
            const brightness = this.brightness(rgb[0], rgb[1], rgb[2]);

            element.getElementsByTagName("code")[0].innerHTML =
                `${color}<br>${this.formatHsl(hsl)}`;

            if (brightness < 130)
            {
                element.classList.add("invert");
            }
        });
    }

    private brightness(r: number, g: number, b: number): number
    {
        return Math.sqrt((r * r * 0.241) + (g * g * 0.691) + (b * b * 0.068));
    }

    private rgbToHsl(r: number, g: number, b: number): number[]
    {
        r /= 255, g /= 255, b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let h = NaN;
        let s = NaN;
        const l = (max + min) / 2;

        if (max === min)
        {
            h = s = 0; // achromatic
        }
        else
        {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max)
            {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [h * 360, s, l];
    }

    private formatHsl(hsl: number[]): string
    {
        return `hsl(${Math.round(hsl[0])}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`;
    }
}
