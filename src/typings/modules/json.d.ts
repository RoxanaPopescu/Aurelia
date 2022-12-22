/**
 * Module declaration required for JSON import statements to work.
 */
declare module "*.json"
{
    const value: any;
    export default value;
}
