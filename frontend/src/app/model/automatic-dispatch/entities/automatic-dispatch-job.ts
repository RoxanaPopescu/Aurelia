import { AutomaticDispatchJobResult, AutomaticDispatchJobStatus } from "..";

export class AutomaticDispatchJob
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.status = new AutomaticDispatchJobStatus(data.status);
        this.name = data.name;

        if (data.result != null)
        {
            this.result = new AutomaticDispatchJobResult(data.result);
        }
    }

    /**
     * The GUID id
     */
    public id: string;

    /**
     * The name identifying the job.
     */
    public readonly name: string;

    /**
     * The status of the route plan.
     */
    public status: AutomaticDispatchJobStatus;

    /**
     * The result - only exist if status is succeded
     */
    public result?: AutomaticDispatchJobResult;
}
