/**
 * Represents the data needed to create a new glossary.
 */
export interface IAccountInit
{
    /**
     * The full name of the user.
     */
    fullName: string;

    /**
     * The preferred name of the user.
     */
    preferredName: string;

    /**
     * The email identifying the user.
     */
    email: string;

    /**
     * The password specified by the user.
     */
    password: string;
}
