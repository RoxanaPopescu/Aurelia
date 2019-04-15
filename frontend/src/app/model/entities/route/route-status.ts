import { Accent } from "app/model/entities/shared";

/**
 * Represents the status of a route.
 */
export class RouteStatus
{
    public constructor(status: keyof typeof RouteStatus.map)
    {
        this.slug = status;
        Object.assign(this, RouteStatus.map[status]);
    }

    public slug: keyof typeof RouteStatus.map;
    public name: string;
    public accent: Accent;
    public value: number;

    public static readonly map =
    {
        requested:
        {
            name: "Requested",
            accent: "neutral",
            value: 1
        },
        accepted:
        {
            name: "Accepted",
            accent: "neutral",
            value: 2
        },
        assigned:
        {
            name: "Assigned",
            accent: "neutral",
            value: 3
        },
        started:
        {
            name: "Started",
            accent: "neutral",
            value: 4
        },
        completed:
        {
            name: "Completed",
            accent: "positive",
            value: 20
        },
        cancelled:
        {
            name: "Cancelled",
            accent: "neutral",
            value: 100
        }
    };
}
