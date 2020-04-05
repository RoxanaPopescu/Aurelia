import { Duration } from "luxon";

export class CommunicationParameters
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            Object.assign(this, data);
        }
    }

    /**
     * The parameters.
     */
    [key: string]: any;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = {};

        for (const key of Object.keys(this))
        {
            const value = this[key];

            if (value instanceof Function)
            {
                continue;
            }

            if (value instanceof Duration)
            {
                data[key] = value.as("seconds");
            }
            else
            {
                data[key] = value;
            }
        }

        return data;
    }
}
