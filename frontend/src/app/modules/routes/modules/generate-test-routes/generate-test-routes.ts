import { autoinject, computedFrom } from "aurelia-framework";
import { TestService } from "app/model/test/services/test-service";
import { RequestTemplate } from "app/model/test/entities/request-template";
import { DateTime } from "luxon";

type Type = "by-id" | "template";
type Result = {
    type: Type,
    name: string,
    failed: boolean,
    id: string,
    slug?: string,
    created: DateTime
};

/**
 * Represents the page.
 */
@autoinject
export class GenerateTestRoutes
{
    /**
     * Creates a new instance of the class.
     * @param vehicleService The `VehicleService` instance.
     */
    public constructor(testService: TestService)
    {
        this._testService = testService;
    }

    private readonly _testService: TestService;

    /**
     * The results of created routes.
     */
    protected results: Result[] = [];

    /**
     * The request id.
     */
    protected requestId?: string;

    /**
     * The driver id.
     */
    protected driverId?: string;

    /**
     * The template.
     */
    protected template?: RequestTemplate;

    /**
     * The available U-turn strategies.
     */
    protected availableTemplates = Object.keys(RequestTemplate.values).map(id => new RequestTemplate(id as any));

    /**
     * Gets the template.
     */
    @computedFrom("availableTemplates", "template")
    protected get selectedTemplate(): RequestTemplate | undefined
    {
        return this.availableTemplates?.find(s => s.id === this.template?.id)
    }

    /**
     * Sets the template.
     */
    protected set selectedTemplate(value: RequestTemplate | undefined)
    {
        this.template = value as any;
    }

    /**
     * Called when a test route is about to be generated
     */
    protected async onGenerate(): Promise<void>
    {
        // FIXME: VALIDATE
        // FIXME: DATE

        let requestId = this.template?.requestId ?? this.requestId;

        const result: Result = {
            type: this.template ? "template" : "by-id",
            failed: false,
            created: DateTime.local(),
            slug: undefined,
            name: this.template?.name ?? this.requestId!,
            id: this.template?.requestId ?? this.requestId!
        }
        this.results.unshift(result);

        try {
            let response = await this._testService.copyRequest(
                requestId!,
                this.driverId
            );

            let index = this.results.findIndex(r => r.id === requestId);
            if (index >= 0) {
                this.results[index].slug = response.slug;
            }
        } catch {
            let index = this.results.findIndex(r => r.id === requestId);
            if (index >= 0) {
                this.results[index].failed = true;
            }
        }
    }

    /**
     * Called when a drivers is about to be selected
     */
    protected onSelectDriver(): void
    {
        this._testService.copyRequest(this.requestId!);
        // FIXME: DO THIS
    }
}
