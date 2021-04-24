/**
 * Represents an object presented on a map.
 */
export interface IGoogleMapObject
{
    /**
     * Called when the component should attach to the owner.
     */
    attach(): void;

    /**
     * Called when the component should detach from the owner.
     */
    detach(): void;
}

/**
 * Represents an object presented on a map.
 */
export interface IGoogleMapObjectOwner
{
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
export abstract class GoogleMapObject implements IGoogleMapObject
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
     * The `IGoogleMapObjectOwner` instance owning this instance.
     */
    protected owner: IGoogleMapObjectOwner;

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        this.owner.register(this);
    }

    /**
     * Called when the component should attach to the owner.
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
     * Called when the component should detach from the owner.
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
