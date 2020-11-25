import { DateTime } from "luxon";
import { UserInfo } from "app/model/user/entities/user-info";

/**
 * Represents metadata for an entity.
 */
export class Metadata
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data != null)
        {
            this.created = DateTime.fromISO(data.created);
            this.createdById = data.createdById;

            if (data.createdBy != null)
            {
                this.createdBy = new UserInfo(data.createdBy);
            }

            this.lastModified = DateTime.fromISO(data.lastModified);
            this.lastModifiedById = data.lastModifiedById;

            if (data.lastModifiedBy != null)
            {
                this.lastModifiedBy = new UserInfo(data.lastModifiedBy);
            }
        }
    }

    /**
     * The date at which the entity was last modified.
     */
    public readonly created: DateTime;

    /**
     * The user who last modified the entity.
     */
    public readonly createdBy?: UserInfo;

    /**
     * The user who last modified the entity.
     */
    public readonly createdById: string;

    /**
     * The date at which the entity was last modified.
     */
    public readonly lastModified: DateTime;

    /**
     * The user who last modified the entity.
     */
    public readonly lastModifiedBy?: UserInfo;

    /**
     * The user who last modified the entity.
     */
    public readonly lastModifiedById: string;
}
