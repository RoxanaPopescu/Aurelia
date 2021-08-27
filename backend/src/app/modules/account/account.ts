import { AppModule } from "../../app-module";
import { AppContext } from "../../app-context";

/**
 * Represents a module exposing endpoints related to account management.
 */
export class AccountModule extends AppModule
{
    /**
     * Creates a new user with the specified name, email and password.
     * @param context.body.fullName The full name of the user.
     * @param context.body.preferredName The preferred name of the user.
     * @param context.body.email The email identifying the user.
     * @param context.body.password The password specified by the user.
     * @returns
     * - 204: No content.
     *   The client may now authenticate using the email and password.
     *   An email will be sent to the user, with a link they can use to confirm their email address.
     *   Note that the email template will be selected based on the API key specified in the request.
     */
    public "POST /v2/account/create" = async (context: AppContext) =>
    {
        await this.apiClient.post("account/signup",
        {
            body:
            {
                fullName: context.request.body.fullName,
                preferredName: context.request.body.preferredName,
                email: context.request.body.email,
                password: context.request.body.password
            }
        });

        context.response.status = 204;
    }

    /**
     * Confirms the email address of a user, by verifying the specified token.
     * @param context.body.token The token specified in the confirmation link sent to the user.
     * @returns
     * - 204: No content.
     *   The client may now show a sign-in view, if not already authenticated.
     */
    public "POST /v2/account/confirm-email" = async (context: AppContext) =>
    {
        await this.apiClient.post("account/confirmuseraccount",
        {
            body:
            {
                token: context.request.body.token
            }
        });

        context.response.status = 204;
    }

    /**
     * Requests password recovery for the user with the specified email.
     * @param context.body.email The email address identifying the user.
     * @returns
     * - 204: No content.
     *   An email will be sent to the user, with a link they can use to change their password.
     *   Note that the email template will be selected based on the API key specified in the request.
     */
    public "POST /v2/account/forgot-password" = async (context: AppContext) =>
    {
        await this.apiClient.post("account/forgotpassword",
        {
            body:
            {
                userEmail: context.request.body.email
            }
        });

        context.response.status = 204;
    }

    /**
     * Changes the password for the current user, or the user identified by the specified token.
     * @param context.body.password The new password chosen by the user.
     * @param context.body.token The token specified in the recovery link sent to the user, or undefined if already authenticated.
     * @param context.body.revokeTokens True to revoke all refresh tokens and access tokens, except the ones associated with this request.
     * @returns
     * - 200: The email address of the user for which the password was changed.
     *   The client may now authenticate using the email and password.
     */
    public "POST /v2/account/change-password" = async (context: AppContext) =>
    {
        if (context.request.body.token == null)
        {
            await context.authorize();
        }

        const result = await this.apiClient.post("account/changeruserpassword",
        {
            body:
            {
                passwordJwtToken: context.request.body.token,
                newPassword: context.request.body.password,
                invalidateTokens: context.request.body.revokeTokens
            }
        });

        context.response.body =
        {
            email: result.data.userEmail
        };

        context.response.status = 200;
    }

    // TODO:BACKEND: Endpoint missing
    /**
     * Deletes the current user.
     * @returns
     * - 204: No content.
     */
    public "POST /v2/account/delete" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("account/delete",
        {
            body:
            {
                userId: context.user!.id
            }
        });

        context.response.status = 204;
    }

    /**
     * Gets the profile for the current user.
     * @returns
     * - 200: An object representing the profile for the current user.
     */
    public "GET /v2/account/profile" = async (context: AppContext) =>
    {
        await context.authorize();

        const result = await this.apiClient.get("identity/account/profile");

        context.response.body =
        {
            email: result.data.email,
            phone: result.data.phone,
            fullName: result.data.fullName,
            preferredName: result.data.preferredName,
            pictureUrl: result.data.pictureUrl
        };

        context.response.status = 200;
    }

    /**
     * Saves the profile for the current user.
     * @param context.body The profile to save.
     * @returns
     * - 204: No content
     */
    public "POST /v2/account/profile/save" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.put("identity/account/profile",
        {
            body:
            {
                email: context.request.body.email,
                phone: context.request.body.phone,
                fullName: context.request.body.fullName,
                preferredName: context.request.body.preferredName,
                pictureUrl: context.request.body.pictureUrl
            }
        });

        context.response.status = 204;
    }
}
