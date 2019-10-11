import { Container, autoinject } from "aurelia-framework";

/**
 * Custom attribute that specifies the name of the surface to apply to the element.
 * At runtime, the name specified for this attribute will be resolved to a path,
 * composed of the name of this surface, and the names of any ancestor surfaces.
 * This allows nested surfaces to be styled in context of the their ancestors.
 */
@autoinject
export class SurfaceCustomAttribute
{
    /**
     * Creates a new instance of the type.
     * @param element The element to which the attribute is applied.
     * @param container The container associated with the component.
     */
    public constructor(element: Element, container: Container)
    {
        this._element = element as HTMLElement;

        if (container.parent.hasResolver(SurfaceCustomAttribute, true))
        {
            this.parent = container.parent.get(SurfaceCustomAttribute);
        }
    }

    private readonly _element: HTMLElement;
    private readonly _children = new Set<SurfaceCustomAttribute>();

    /**
     * The parent surface of this surface, or undefined if ths surface has no parent.
     */
    protected readonly parent: SurfaceCustomAttribute | undefined;

    /**
     * The name of the surface to apply.
     */
    public value: string;

    /**
     * The path identifying this surface in context of its ancestor surfaces.
     */
    public get path(): string
    {
        // If a parent was found in the container hierarchy, use its path as the base path.
        if (this.parent != null)
        {
            return `${this.parent.path}/${this.value}`;
        }

        // If no parent was found in the container hierarchy, walk up the DOM tree looking
        // for any `surface` attributes specified on elements outside the app root element.
        // If one is found, use its attribute value as the base path.

        let parentElement = this._element.parentElement;

        while (parentElement)
        {
            const parentSurfaceName = parentElement.getAttribute("surface");

            if (parentSurfaceName)
            {
                return `${parentSurfaceName}/${this.value}`;
            }

            parentElement = parentElement.parentElement;
        }

        // If no parent was found, the path is the name of this surface.
        return this.value;
    }

    /**
     * Called by the framework when the component is attached.
     */
    public attached(): void
    {
        if (this.parent != null)
        {
            this.parent.attachChild(this);
        }

        this.valueChanged();
    }

    /**
     * Called by the framework when the component is detached.
     */
    public detached(): void
    {
        if (this.parent != null)
        {
            this.parent.detachChild(this);
        }
    }

    /**
     * Called by a child surface when it is being attached.
     * Adds the child surface to the collection of child surfaces.
     */
    public attachChild(child: SurfaceCustomAttribute): void
    {
        this._children.add(child);
    }

    /**
     * Called by a child surface when it is being detached.
     * Removes the child surface from the collection of child surfaces.
     */
    public detachChild(child: SurfaceCustomAttribute): void
    {
        this._children.delete(child);
    }

    /**
     * Called by the framework when the `value` property changes.
     */
    protected valueChanged(): void
    {
        this._element.setAttribute("surface", this.path);

        for (const child of this._children)
        {
            child.valueChanged();
        }
    }
}
