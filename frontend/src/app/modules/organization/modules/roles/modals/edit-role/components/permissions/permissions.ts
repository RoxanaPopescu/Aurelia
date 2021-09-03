import { autoinject, bindable, bindingMode } from "aurelia-framework";
import { groupItems } from "shared/utilities";

/**
 * Represents a permission.
 */
export interface IPermission
{
    /**
     * The slug identifying the permission.
     */
    slug: string;

    /**
     * The type of access granted by the permission.
     */
    type: "view" | "edit";

    /**
     * The localized name of the permission.
     */
    name: string;

    /**
     * The localized name of the group to which the permission belongs
     */
    group: string;
}

/**
 * Represents a permission that may be enabled or disabled.
 */
export class Permission
{
    /**
     * Creates a new instance of the type.
     * @param permission The data representing the permission.
     */
    public constructor(permission: IPermission)
    {
        this.slug = permission.slug;
        this.name = permission.name;
        this.enabled = false;
    }

    /**
     * The slug identifying the permission.
     */
    public slug: string;

    /**
     * The localized name of the permission.
     */
    public name: string;

    /**
     * True if the permission is enabled, false if the
     * permission is disabled, or undefined if not set.
     */
    public enabled: boolean | undefined;
}

/**
 * Represents a group of permissions that may be enabled or disabled.
 */
export class PermissionGroup
{
    /**
     * Creates a new instance of the type.
     * @param name The name of the group.
     * @param permissions The data representing the available permissions within the group.
     */
    public constructor(name: string, permissions: IPermission[])
    {
        const types = groupItems(permissions, p => p.type);

        this.name = name;
        this.expanded = false;
        this.viewExpanded = false;
        this.editExpanded = false;
        this.viewPermissions = types.get("view")?.map(p => new Permission(p)) ?? [];
        this.editPermissions = types.get("edit")?.map(p => new Permission(p)) ?? [];
    }

    /**
     * The localized name of the group.
     */
    public name: string;

    /**
     * True if the group is expanded, otherwise false.
     */
    public expanded: boolean;

    /**
     * True if the view subgroup is expanded, otherwise false.
     */
    public viewExpanded: boolean;

    /**
     * True if the edit subgroup is expanded, otherwise false.
     */
    public editExpanded: boolean;

    /**
     * The view permissions within the group.
     */
    public viewPermissions: Permission[];

    /**
     * The edit permissions within the group.
     */
    public editPermissions: Permission[];

    /**
     * True if all permissions are enabled, false if all permissions are disabled,
     * or null if some permissions are enabled and some are disabled.
     */
    public get enabled(): boolean | null
    {
        const viewEnabled = this.viewPermissions.length === 0 || this.viewEnabled;
        const editEnabled = this.editPermissions.length === 0 || this.editEnabled;
        const hasBoth = this.viewPermissions.length !== 0 && this.editPermissions.length !== 0;
        const isDifferent = hasBoth && (viewEnabled !== editEnabled);

        return (isDifferent || viewEnabled === null || viewEnabled === null) ? null : viewEnabled && editEnabled;
    }

    public set enabled(value: boolean | null)
    {
        this.viewEnabled = value;
        this.editEnabled = value;
    }

    /**
     * True if all view permissions are enabled, false if all view ermissions are disabled,
     * or null if some view permissions are enabled and some are disabled.
     */
    public get viewEnabled(): boolean | null
    {
        const hasEnabled = this.viewPermissions.some(p => p.enabled ?? undefined);
        const hasDisabled = this.viewPermissions.some(p => !p.enabled ?? undefined);

        return hasEnabled && hasDisabled ? null : hasEnabled && !hasDisabled;
    }

    public set viewEnabled(value: boolean | null)
    {
        this.viewPermissions.forEach(p => p.enabled = value ?? undefined);
    }

    /**
     * True if all edit permissions are enabled, false if all edit ermissions are disabled,
     * or null if some edit permissions are enabled and some are disabled.
     */
    public get editEnabled(): boolean | null
    {
        const hasEnabled = this.editPermissions.some(p => p.enabled);
        const hasDisabled = this.editPermissions.some(p => !p.enabled);

        return hasEnabled && hasDisabled ? null : hasEnabled && !hasDisabled;
    }

    public set editEnabled(value: boolean | null)
    {
        this.editPermissions.forEach(p => p.enabled = value ?? undefined);
    }
}

/**
 * Represents a permission configuration, in which permissions may be enabled or disabled.
 */
export class PermissionConfig
{
    /**
     * Creates a new instance of the type.
     * @param permissions The data representing the available permissions.
     */
    public constructor(permissions: IPermission[])
    {
        const groups = groupItems(permissions, p => p.group);

        for (const [group, groupPermissions] of groups)
        {
            this.groups.push(new PermissionGroup(group, groupPermissions));
        }
    }

    /**
     * The permission groups.
     */
    public groups: PermissionGroup[] = [];

    /**
     * Gets the currently enabled permissions.
     * @returns The slugs identifying the set of enabled permissions.
     */
    public getEnabled(): string[]
    {
        const result: Permission[] = [];

        for (const group of this.groups)
        {
            result.push(...group.viewPermissions.filter(p => p.enabled));
            result.push(...group.editPermissions.filter(p => p.enabled));
        }

        return result.map(p => p.slug);
    }

    /**
     * Sets the currently enabled permissions.
     * @param slugs The slugs identifying the set of enabled permissions, or undefined to reset all to undefined.
     */
    public setEnabled(slugs: string[] | undefined): void
    {
        for (const group of this.groups)
        {
            group.viewPermissions.forEach(p => p.enabled = slugs?.includes(p.slug) ?? false);
            group.editPermissions.forEach(p => p.enabled = slugs?.includes(p.slug) ?? false);
        }

        // TODO: Throw error if setting an unknown permission?
    }
}

@autoinject
export class PermissionsCustomElement
{
    /**
     * The permission configuration.
     */
    protected config: PermissionConfig | undefined;

    /**
     * The slugs identifying the set of enabled permissions, or undefined if not known.
     */
    @bindable({ defaultBindingMode: bindingMode.twoWay })
    public value: string[] | undefined;

    /**
     * True if the component can be expanded, otherwise false.
     */
    @bindable
    public permissions: IPermission[] | undefined;

    /**
     * True if the component is readonly, otherwise false.
     */
    @bindable({ defaultValue: false })
    public readonly: boolean;

    /**
     * Called by the framework when the `value` property changes.
     * Sets the enabled permissions in the current permission configuration.
     */
    protected valueChanged(): void
    {
        if (this.config != null)
        {
            this.config.setEnabled(this.value);
        }
    }

    /**
     * Called by the framework when the `permissions` property changes.
     * Creates a new permission configuration, based on the specified permissions,
     * with the permissions specified by the current component value enabled.
     */
    protected permissionsChanged(): void
    {
        if (this.permissions != null)
        {
            const config = new PermissionConfig(this.permissions);

            if (this.value != null)
            {
                config.setEnabled(this.value);
            }

            this.config = config;
        }
    }

    /**
     * Called when the enabled state of a permission is toggled.
     * @param permission The permission that was toggled.
     */
    protected onPermissionsChanged(): void
    {
        // Replace the component value.
        setTimeout(() => this.value = this.config!.getEnabled());
    }
}
