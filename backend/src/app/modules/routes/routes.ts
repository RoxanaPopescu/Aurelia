import { AppContext } from "../../app-context";
import { AppModule } from "../../app-module";

/**
 * Represents a module exposing endpoints related to route details
 */
export class RoutesModule extends AppModule
{
    /**
     * Assigns a team or removes a team from a route
     * @returns 200 OK if the team is changed
     */
    public "POST /v2/routes/assign-team" = async (context: AppContext) =>
    {
        const body = context.request.body;

        await context.authorize("edit-routes", { teams: body.teamId == null ? undefined : [body.teamId] });

        const result = await this.apiClient.post("logistics-platform/routes/v4/assign-team",
        {
            noi: true,
            body: {
                ...body,
                fulfillerIds: [context.user?.organizationId],
                organizationId: context.user?.organizationId,
                modifiedById: context.user?.id
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Returns drivers near the route
     * @returns The drivers available near the route
     */
    public "POST /v2/routes/drivers-available-nearby" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const result = await this.apiClient.post("logistics-platform/routes/v4/drivers-available-near-route",
        {
            noi: true,
            body: {
                ...context.request.body,
                fulfillerIds: [context.user?.organizationId],
                CurrentOutfit: context.user?.organizationId
            }
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Will add a support note to the route
     * @returns 200 OK if support note is saved
     */
    public "POST /v2/routes/add-support-note" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];
        body.username = context.user?.email;

        const result = await this.apiClient.post("logistics-platform/routes/v3/add-support-note",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Get current driver positions
     * @returns The positions of the drivers
     */
    public "POST /v2/routes/driver-positions" = async (context: AppContext) =>
    {
        await context.authorize("view-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];

        const result = await this.apiClient.post("logistics-platform/routes/v4/driver-positions",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Will reload the route in the driver app
     * @returns 200 OK if driver app is reloaded
     */
    public "POST /v2/routes/reload-driver-app" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerId = context.user?.organizationId;
        body.actionBy = context.user?.id;

        const result = await this.apiClient.get("logistics-platform/routes/v2/reload-route",
        {
            noi: true,
            query: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Will remove a driver from the route.
     * @returns 200 OK if the driver is removed
     */
    public "POST /v2/routes/remove-driver" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];

        const result = await this.apiClient.post("logistics-platform/routes/v4/remove-driver",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Will add a support note to the route
     * @returns 200 OK if support note is saved
     */
    public "POST /v2/routes/update" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];

        const result = await this.apiClient.post("logistics-platform/routes/v4/update-route",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }

    /**
     * Updated the status of the route
     * @returns 200 OK if added
     */
    public "POST /v2/routes/update-status" = async (context: AppContext) =>
    {
        await context.authorize("edit-routes");

        const body = context.request.body;
        body.fulfillerIds = [context.user?.organizationId];

        const result = await this.apiClient.post("logistics-platform/routes/v4/update-status",
        {
            noi: true,
            body: body
        });

        context.response.body = result.data;
        context.response.status = 200;
    }
}
