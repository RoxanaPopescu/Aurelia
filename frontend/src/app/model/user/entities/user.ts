import { UserStatus } from "./user-status";
import { RoleInfo } from "app/model/role/entities/role-info";

/**
 * Represents a user.
 */
export class User
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.id = data.id;
        this.username = data.userName;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.outfitId = data.outfitId;
        this.role = new RoleInfo({ id: data.roleId, name: data.roleName });
        this.status = new UserStatus(data.status.name);
        this.canDeactivate = data.canDeactivate;
        this.canActivate = data.canActivate;
    }

    /**
     * The ID of the user
     */
    public id: string;

    /**
     * The first name of the user.
     */
    public username: string;

    /**
     * The first name of the user.
     */
    public firstName: string;

    /**
     * The last name of the user.
     */
    public lastName: string;

    /**
     * The email of the user.
     */
    public email: string;

    /**
     * The ID of the outfit associated with the user.
     */
    public outfitId: string;

    /**
     * The role assigned to the user.
     */
    public role: RoleInfo;

    /**
     * The status of the user.
     */
    public status: UserStatus;

    /**
     * True if the user can be activated, otherwise false.
     */
    public canActivate: boolean;

    /**
     * True if the user can be deactivated, otherwise false.
     */
    public canDeactivate: boolean;
}
