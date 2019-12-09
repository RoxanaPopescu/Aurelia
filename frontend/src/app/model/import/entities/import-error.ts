import { ImportErrorRow } from "..";

export class ImportError
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.columnName = data.columnName;
        this.name = data.name;
        this.rows = data.rows;
    }

    public readonly columnName: string;

    public readonly name: string;

    public readonly rows: ImportErrorRow[];
}
