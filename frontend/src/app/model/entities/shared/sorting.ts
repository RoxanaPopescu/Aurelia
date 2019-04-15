/**
 * Represents a sorting direction.
 */
export class SortingDirection
{
    public constructor(status: keyof typeof SortingDirection.map)
    {
        this.slug = status;
        Object.assign(this, SortingDirection.map[status]);
    }

    public slug: keyof typeof SortingDirection.map;
    public name: string;
    public id: number;

    public static readonly map =
    {
        Ascending:
        {
            name: "Ascending",
            id: 1
        },
        Descending:
        {
            name: "Descending",
            id: 2
        }
    };
}
