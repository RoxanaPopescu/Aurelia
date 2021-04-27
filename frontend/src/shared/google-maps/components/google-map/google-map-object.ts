/**
 * Represents an object that owns one or more objects presented on a map.
 */
export interface IGoogleMapObjectOwner
{
    /**
     * The `google.maps.MVCObject` instance representing the object.
     */
    instance: google.maps.MVCObject | undefined;

    /**
     * Registers the specified objects as owned by this object.
     */
    register(...objects: GoogleMapObject[]): void;

    /**
     * Unregisters the specified objects as owned by this object.
     */
    unregister(...objects: GoogleMapObject[]): void;
}

/**
 * Represents an object presented on a map.
 */
export interface IGoogleMapObject
{
    /**
     * Called by the owner when the component should attach to the map.
     */
    attach(): void;

    /**
     * Called by the owner when the component should detach from the map.
     */
    detach(): void;
}

/**
 * Represents an object presented on a map.
 */
export abstract class GoogleMapObject<TObject extends google.maps.MVCObject = google.maps.MVCObject> implements IGoogleMapObject
{
    /**
     * Creates a new instance of the type.
     * @param owner The `IGoogleMapObjectOwner` instance owning this instance.
     */
    public constructor(owner: IGoogleMapObjectOwner)
    {
        this.owner = owner;
    }

    private readonly _objects: GoogleMapObject[] = [];
    private _attached = false;

    /**
     * The `IGoogleMapObjectOwner` instance owning this object.
     */
    public readonly owner: IGoogleMapObjectOwner;

    /**
     * The `google.maps.MVCObject` instance representing the object.
     */
    public instance: TObject | undefined;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this.owner.register(this);
    }

    /**
     * Called by the owner when the component should attach itself to the map.
     */
    public attach(): void
    {
        this._attached = true;

        for (const object of this._objects.slice())
        {
            object.attach();
        }
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        this.owner.unregister(this);
    }

    /**
     * Called by the owner when the component should detach itself from the map.
     */
    public detach(): void
    {
        for (const object of this._objects.slice())
        {
            object.detach();
        }

        this._attached = false;
    }

    /**
     * Registers the specified objects as owned by this object.
     */
    public register(...objects: GoogleMapObject[]): void
    {
        for (const object of objects)
        {
            const index = this._objects.indexOf(object);

            if (index === -1)
            {
                this._objects.push(object);

                if (this._attached)
                {
                    object.attach();
                }
            }
        }
    }

    /**
     * Unregisters the specified objects as owned by this object.
     */
    public unregister(...objects: GoogleMapObject[]): void
    {
        for (const object of objects)
        {
            const index = this._objects.indexOf(object);

            if (index !== -1)
            {
                this._objects.splice(index, 1);

                if (this._attached)
                {
                    object.detach();
                }
            }
        }
    }
}
