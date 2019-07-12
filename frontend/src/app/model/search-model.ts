/**
 * Represents a model representing the searchable text in an entity.
 */
export class SearchModel
{
    /**
     * Creates a new instance of the type.
     * @param entity The entity from which the search model should be created.
     */
    public constructor(entity: object)
    {
        this._entity = entity;
    }

    private readonly _entity: object;
    private _json: string | undefined;

    /**
     * Determines whether the search model contains the specified text.
     * @param text The text to search for.
     * @returns True if the model contains the specified text, otherwise false.
     */
    public contains(text?: string): boolean
    {
        if (!text)
        {
            return true;
        }

        if (this._json == null)
        {
            this._json = JSON.stringify(this._entity, null, 1).toLowerCase();
        }

        const q = text.toLowerCase();

        return new RegExp(`^\\s*"[^"]+":.*${q}.*$|^\\s*"[^"]*${q}[^"]*",?$`, "m").test(this._json);
    }
}
