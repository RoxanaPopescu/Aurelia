import { DateTime } from "luxon";

export class OrderEvent
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.date = data.date;
        this.name = data.name;
        this.location = data.location;
        this.author = data.author;
    }

    public readonly id: string;

    public readonly date: DateTime;

    public readonly name: string;

    public readonly location: string;

    public readonly author: { name: string; affiliation: string; };
}
