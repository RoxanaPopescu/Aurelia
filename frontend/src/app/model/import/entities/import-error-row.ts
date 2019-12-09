export class ImportErrorRow
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.rowIndex = data.rowIndex;
        this.message = data.message;
        this.cellValue = data.cellValue;
    }

    public readonly rowIndex: number;

    public readonly message: string;

    public readonly cellValue: string;
}
