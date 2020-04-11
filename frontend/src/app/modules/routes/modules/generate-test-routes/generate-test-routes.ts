import { autoinject, computedFrom, observable } from "aurelia-framework";
import { TestService } from "app/model/test/services/test-service";
import { RequestTemplate } from "app/model/test/entities/request-template";
import { DateTime, Duration } from "luxon";
import { ModalService, IValidation } from "shared/framework";
import { AssignDriverPanel } from "./modals/assign-driver/assign-driver";
import { Driver } from "app/model/driver";
import { Uuid } from "shared/utilities/id/uuid";

type Type = "by-id" | "template";
type Result = {
    type: Type,
    name: string,
    failed: boolean,
    id: string,
    requestId: string,
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
     * @param modalService The `ModalService` instance.
     */
    public constructor(testService: TestService, modalService: ModalService)
    {
        this._testService = testService;
        this._modalService = modalService;
    }

    private readonly _testService: TestService;
    private readonly _modalService: ModalService;

    /**
     * The validation for the modal.
     */
    protected validation: IValidation;

    /**
     * The results of created routes.
     */
    @observable
    protected results: Result[] = [];

    /**
     * The request id.
     */
    protected requestId?: string;

    /**
     * The driver id.
     */
    protected driver?: Driver;

    /**
     * The template.
     */
    protected template?: RequestTemplate;

    /**
     * The date to create from
     */
    @observable
    public date: DateTime | undefined;

    /**
     * The time to create from
     */
    @observable
    public time: Duration | undefined;

    /**
     * The dateTime to create from
     */
    public dateTime: DateTime | undefined;

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
     * Called when the observable property, date, changes value.
     */
    protected dateChanged(newValue: DateTime | undefined): void
    {
        this.dateTimeChanged();
    }

    /**
     * Called when the observable property, time, changes value.
     */
    protected timeChanged(newValue: Duration | undefined): void
    {
        this.dateTimeChanged();
    }

    /**
     * Called when the timeFrom, time changes value.
     */
    protected dateTimeChanged(): void
    {
        if (this.date == null || this.time == null) {
            return;
        }

        this.dateTime = this.date.startOf("day").plus(this.time);
    }

    /**
     * Called when a test route is about to be generated
     */
    protected async onGenerate(): Promise<void>
    {
        this.validation.active = true;
        if (!await this.validation.validate())
        {
            return;
        }
        this.validation.active = false;

        let requestId = this.template?.requestId ?? this.requestId;

        const id = Uuid.v1();
        const result: Result = {
            type: this.template ? "template" : "by-id",
            failed: false,
            created: DateTime.local(),
            id: id,
            slug: undefined,
            name: this.template?.name ?? this.requestId!,
            requestId: this.template?.requestId ?? this.requestId!
        }
        this.results.unshift(result);

        try {
            let response = await this._testService.copyRequest(
                requestId!,
                this.driver?.id,
                this.dateTime
            );

            let index = this.results.findIndex(r => r.id === id);
            if (index >= 0) {
                this.results[index].slug = response.slug;
            }
        } catch {

            let index = this.results.findIndex(r => r.id === id);
            if (index >= 0) {
                this.results[index].failed = true;
            }
        }
    }

    /**
     * Called when a drivers is about to be selected
     */
    protected async onSelectDriver(): Promise<void>
    {
        this.driver = await this._modalService.open(AssignDriverPanel).promise;
    }
}
