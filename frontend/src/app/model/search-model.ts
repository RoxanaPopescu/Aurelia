/**
 * Represents the searchable text of an entity.
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
     * @param caseSensitive True to do a case sensitive search, otherwise false.
     * @returns True if the model contains the specified text, otherwise false.
     */
    public contains(text?: string, caseSensitive = false): boolean
    {
        // An empty query is always a match.
        if (!text)
        {
            return true;
        }

        // Get a JSON representation of the entity, ignoring circular references.

        const objects = new Set<any>();

        objects.add(this);
        objects.add(this._entity);

        if (this._json == null)
        {
            this._json = JSON.stringify(this._entity, (key, value) =>
            {
                return key && objects.has(value) ? "" : value;
            },
            1).toLowerCase();
        }

        // Search the JSON representation of the object.

        const q = caseSensitive ? text : text.toLowerCase();

        return new RegExp(`^\\s*"[^"]+":.*${q}.*$|^\\s*"[^"]*${q}[^"]*",?$`, "m").test(this._json);
    }
}
