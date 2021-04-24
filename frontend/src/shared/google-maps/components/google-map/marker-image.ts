/**
 * Represents the image used to present a marker on a map.
 */
export interface IMarkerImage
{
    /**
     * The URL of the image.
     */
    readonly url: string;

    /**
     * The intrinsic width and height of the image.
     */
    readonly size?: [number, number];

    /**
     * The scaled width and height of the image.
     */
    readonly scaledSize?: [number, number];

    /**
     * The anchor position within the scaled image.
     */
    readonly anchor?: [number, number];
}
