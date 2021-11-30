/**
 * Module declaration required for SVG import statements to work.
 */
declare module "*.svg"
{
    const value: string;
    export default value;
}

/**
 * Module declaration required for PNG import statements to work.
 */
declare module "*.png"
{
    const value: string;
    export default value;
}

/**
 * Module declaration required for JPG import statements to work.
 */
declare module "*.jpg"
{
    const value: string;
    export default value;
}
