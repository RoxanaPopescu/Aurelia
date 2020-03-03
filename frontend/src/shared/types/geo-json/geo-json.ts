// Based on the GeoJSON specification, IETF RFC 7946.
// See: https://tools.ietf.org/html/rfc7946

/**
 * Provides methods for working with GeoJSON objects, including methods for creating typed GeoJSON
 * geometry objects, based on GeoJSON strings or data.
 */
export abstract class GeoJson
{
    /**
     * Parses the specified GeoJSON string, returning an instance of the appropiate GeoJsonGeometry type.
     * @param geoJsonString A JSON string representing a serialized GeoJSON object.
     * @returns A GeoJsonGeometry instance representing the geometry.
     */
    public static parse(geoJsonString: string): GeoJsonGeometry
    {
        return GeoJson.create(JSON.parse(geoJsonString));
    }

    /**
     * Creates an instance of the appropiate GeoJsonGeometry type, based on the specified GeoJSON data.
     * @param geoJson An object representing a GeoJSON geometry.
     * @returns A GeoJSON Geometry object.
     */
    public static create(geoJson: GeoJsonGeometry): GeoJsonGeometry
    {
        switch (geoJson.type)
        {
            case "Point":
                return new GeoJsonPoint(geoJson as GeoJsonPoint);

            case "Polygon":
                return new GeoJsonPolygon(geoJson);

            case "MultiPolygon":
                return new GeoJsonMultiPolygon(geoJson);

            default:
                throw new Error(`The GeoJSON type '${geoJson.type}' is not supported.`);
        }
    }
}

/**
 * Represents the base type for all GeoJSON object types.
 */
export abstract class GeoJsonObject
{
    /**
     * Creates a new instance of the GeoJsonObject type.
     * @param type The GeoJSON object type.
     * @param bbox The coordinates of the bounding box of the object.
     */
    public constructor(type: string, bbox?: number[])

    /**
     * Creates a new instance of the GeoJsonObject type.
     * @param geoJson A GeoJSON object.
     */
    public constructor(geoJson: GeoJsonObject)

    public constructor(...args)
    {
        if (typeof args[0] === "string")
        {
            this.type = args[0];
            this.bbox = args[1];
        }
        else
        {
            this.type = args[0].type;
            this.bbox = args[0].bbox;
        }
    }

    /**
     * The GeoJSON object type.
     */
    public type: string;

    /**
     * The coordinates of the bounding box of the object, if specified.
     */
    public bbox: number[];
}

/**
 * Represents the base type for all GeoJSON Geometry types.
 */
export abstract class GeoJsonGeometry extends GeoJsonObject
{
    /**
     * Creates a new instance of the GeoJsonGeometry type.
     * @param type The GeoJSON geometry type.
     * @param coordinates The GeoJSON geometry coordinates.
     * @param bbox The coordinates of the bounding box of the object.
     */
    public constructor(type: string, coordinates: any, bbox?: number[])

    /**
     * Creates a new instance of the GeoJsonGeometry type.
     * @param geoJson A GeoJSON Geometry object.
     */
    public constructor(geoJson: GeoJsonGeometry)

    public constructor(...args)
    {
        if (typeof args[0] === "string")
        {
            super(args[0], args[2]);
            this.coordinates = args[1];
        }
        else
        {
            super(args[0]);
            this.coordinates = args[0].coordinates;
        }
    }

    /**
     * The GeoJSON coordinates of the geometry.
     */
    public coordinates: any;
}

/**
 * Represents a GeoJSON GeometryCollection.
 */
export class GeoJsonGeometryCollection extends GeoJsonObject
{
    /**
     * Creates a new instance of the GeoJsonGeometryCollection type.
     * @param geometries The GeoJSON geometry objects in the collection.
     * @param bbox The coordinates of the bounding box of the object.
     */
    public constructor(geometries: any, bbox?: number[])

    /**
     * Creates a new instance of the GeoJsonGeometryCollection type.
     * @param geoJson A GeoJSON GeometryCollection object.
     */
    public constructor(geoJson: GeoJsonGeometryCollection)

    public constructor(...args)
    {
        if (typeof args[0] === "string")
        {
            super(args[0], args[2]);
            this.geometries = args[1];
        }
        else
        {
            super(args[0]);
            this.geometries = args[0].geometries;
        }
    }

    /**
     * The GeoJSON geometry objects in the collection.
     */
    public geometries: GeoJsonGeometry[];
}

/**
 * Represents a GeoJSON Point.
 */
export class GeoJsonPoint extends GeoJsonGeometry
{
    /**
     * Creates a new instance of the GeoJsonPoint type.
     * @param coordinates The GeoJSON geometry coordinates.
     */
    public constructor(coordinates: number[])

    /**
     * Creates a new instance of the GeoJsonPoint type.
     * @param geoJson A GeoJSON Point object.
     */
    public constructor(geoJson: GeoJsonPoint)

    public constructor(...args)
    {
        if (args[0] instanceof Array)
        {
            super("Point", args[0]);
        }
        else
        {
            if (args[0].type !== "Point")
            {
                throw new Error("The specified GeoJSON does not represent a Point object.");
            }

            super(args[0]);
        }
    }

    /**
     * The GeoJSON coordinates of the point, represented by an array,
     * in which the items are longitude, latitude, and optionally altitude.
     */
    public coordinates: [number, number];
}

/**
 * Represents the base type for all GeoJSON Geometry types that has an area.
 */
export abstract class GeoJsonArea extends GeoJsonGeometry
{
}

/**
 * Represents a GeoJSON Polygon.
 */
export class GeoJsonPolygon extends GeoJsonArea
{
    /**
     * Creates a new instance of the GeoJsonPoint type.
     * @param coordinates The GeoJSON geometry coordinates.
     * @param bbox The coordinates of the bounding box of the object.
     */
    public constructor(coordinates: number[][][], bbox?: number[])

    /**
     * Creates a new instance of the GeoJsonPolygon type.
     * @param geoJson A GeoJSON Polygon object.
     */
    public constructor(geoJson: GeoJsonPolygon)

    public constructor(...args)
    {
        if (args[0] instanceof Array)
        {
            super("Polygon", args[0], args[1]);
        }
        else
        {
            if (args[0].type !== "Polygon")
            {
                throw new Error("The specified GeoJSON does not represent a Polygon object.");
            }

            super(args[0]);
        }
    }

    /**
     * The GeoJSON coordinates of the points in the polygon, represented by an array of 'LinearRing' arrays,
     * in which the items are a sequence of positions, where each position is represented by an array,
     * in which the the items are longitude, latitude, and optionally altitude.
     */
    public coordinates: number[][][];
}

/**
 * Represents a GeoJSON MultiPolygon, specified as an array of sequences of positions, by default in the WGS84/EPSG:4326 datum.
 */
export class GeoJsonMultiPolygon extends GeoJsonArea
{
    /**
     * Creates a new instance of the GeoJsonPoint type.
     * @param coordinates The GeoJSON geometry coordinates.
     * @param bbox The coordinates of the bounding box of the object.
     */
    public constructor(coordinates: number[][][][], bbox?: number[])

    /**
     * Creates a new instance of the GeoJsonMultiPolygon type.
     * @param geoJson A GeoJSON MultiPolygon object.
     */
    public constructor(geoJson: GeoJsonMultiPolygon)

    public constructor(...args)
    {
        if (args[0] instanceof Array)
        {
            super("MultiPolygon", args[0], args[1]);
        }
        else
        {
            if (args[0].type !== "MultiPolygon")
            {
                throw new Error("The specified GeoJSON does not represent a MultiPolygon object.");
            }

            super(args[0]);
        }
    }

    /**
     * The GeoJSON coordinates of the points in the polygons, represented by an array of polygons, where each
     * polygon is represented as an array of 'LinearRing' arrays, in which the items are sequences of positions,
     * where each position is represented by an array, in which the first item is the latitude and the second is the longitude.
     */
    public coordinates: number[][][][];
}
