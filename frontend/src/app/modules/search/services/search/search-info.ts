import { DateTime } from "luxon";

/**
 * Represents info about a search
 */
export class SearchInfo
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.etag = data.etag;
        this.id = data.id;
        this.text = data.text;
        this.createdDateTime = DateTime.fromISO(data.createdDateTime, { setZone: true });
    }

    /**
     * The entity tag used for concurrency control.
     */
    public etag: string | undefined;

    /**
     * The ID of the search.
     */
    public id: string;

    /**
     * The search text.
     */
    public text: string;

    /**
     * The date at which the search was executed.
     */
    public createdDateTime: DateTime;
}
