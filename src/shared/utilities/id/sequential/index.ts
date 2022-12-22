let nextId = 0;

export namespace Sequential
{
    /**
     * Gets the next numeric sequential ID, starting from 0.
     * Note that this is only unique within the app session.
     * @returns The next sequential numeric ID.
     */
    export function next(): number
    {
        return nextId++;
    }
}
