import { GeoJsonPolygon } from "shared/types";

export class AutoContractorAssignmentConditions
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.polygons = data.polygons?.map(polygon => new GeoJsonPolygon([polygon.positions.slice(0, -1).map(p => [p.longitude, p.latitude])])) ?? [];
        }
        else
        {
            this.polygons = [];
        }
    }

    public polygons: GeoJsonPolygon[] | undefined;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        const data = { ...this } as any;

        data.polygons = this.polygons?.map(p => ({ positions: p.coordinates[0].map(c => ({ longitude: c[0], latitude: c[1] }))}))

        data.polygons.forEach(p => p.positions.push(p.positions[0]));

        return data;
    }
}
