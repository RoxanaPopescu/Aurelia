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
            if (data.created != null)
            {
                this.created = DateTime.fromISO(data.created);
            }

            if (data.createdBy != null)
            {
                this.createdBy = new UserInfo(data.createdBy);
            }

            if (data.lastModified != null)
            {
                this.lastModified = DateTime.fromISO(data.lastModified);
            }

            if (data.lastModifiedBy != null)
            {
                this.lastModifiedBy = new UserInfo(data.lastModifiedBy);
            }
        }
    }

    /**
     * The date at which the entity was last modified.
     */
    public readonly created?: DateTime;

    /**
     * The user who last modified the entity.
     */
    public readonly createdBy?: UserInfo;

    /**
     * The date at which the entity was last modified.
     */
    public readonly lastModified?: DateTime;

    /**
     * The user who last modified the entity.
     */
    public readonly lastModifiedBy?: UserInfo;
}
