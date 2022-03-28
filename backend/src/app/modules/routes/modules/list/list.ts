import { AppContext } from "../../../../app-context";
import { AppModule } from "../../../../app-module";

/**
 * Represents a module exposing endpoints related to route list
 */
export class RoutesListModule extends AppModule
{
    /**
     * Get the list of routes
     * @returns list of routes
     */
    public "POST /v2/routes/list" = async (context: AppContext) =>
    {
        const body = context.request.body;
        await context.authorize("view-routes", { teams: body.teams });

        body.includeTotalCount = false;
        body.fulfillerIds = [context.user?.organizationId];
        body.organizationId = context.user?.organizationId;

        // TODO: Generalize this part
        const accessAllTeams = context.user?.permissions.has("access-all-teams") ?? false;

        let teams = body.teams;
        if (teams == null)
        {
            if (!accessAllTeams)
            {
                teams = context.user?.teamIds ?? [];
            }
        }

        if (teams == null)
        {
            delete body.teams;
        }
        else
        {
            const teamIds = teams.filter((t: any) => t !== "no-team");
            const includeNoTeam: boolean | undefined = teams.some((t: any) => t === "no-team");

            body.teams =
            {
                ids: teamIds ?? [],
                includeNoTeam: includeNoTeam ?? true
            };
        }
        // TODO: End generalize

        const result = await this.apiClient.post("logistics-platform/routes/v4/list",
        {
            noi: true,
            body: body
        });

        const data = result.data;

        if (body.include.fulfiller != null && body.include.fulfiller)
        {
            const organizatonIds = data.routes.map((r: any) => r.fulfiller.id);
            const fulfillerResult = await this.apiClient.post("logistics/outfits/fulfiller/list",
            {
                body: {
                    ids: organizatonIds
                }
            });
            const fulfillers = fulfillerResult.data.results;

            for (const route of data.routes)
            {
                const id = route.fulfiller.id;
                const fulfuller = fulfillers.find((f: any) => f.id === id);
                if (fulfuller != null)
                {
                    route.fulfiller = fulfuller;
                }
                else
                {
                    delete route.fulfiller;
                }
            }
        }

        context.response.body = data;
        context.response.status = 200;
    }
}
