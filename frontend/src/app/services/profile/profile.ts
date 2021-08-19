/**
 * Represents the profile for a user.
 */
export class Profile
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.email = data.email;
        this.phone = data.phone;
        this.fullName = data.fullName;
        this.preferredName = data.preferredName;
        this.pictureUrl = data.pictureUrl;
    }

    /**
     * The email address of the user.
     */
    public email: string;

    /**
     * The phone number of the user.
     */
    public phone: string;

    /**
     * The full name of the user.
     */
    public fullName: string;

    /**
     * The preferred name of the user.
     */
    public preferredName: string;

    /**
     * The URL for the user picture.
     */
    public pictureUrl: string;

    /**
     * Gets an object representing the settings for this instance.
     * @returns An object representing the settings for this instance.
     */
    public getSettings(): Partial<Profile>
    {
        return {
            email: this.email,
            phone: this.phone,
            fullName: this.fullName,
            preferredName: this.preferredName,
            pictureUrl: this.pictureUrl
        };
    }

    /**
     * Applies the specified settings to this instance.
     * @param model The settings to apply to this instance.
     */
    public setSettings(model: Partial<Profile>): void
    {
        Object.assign(this, model);
    }
}
