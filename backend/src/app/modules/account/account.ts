import { AppModule } from "../../app-module";
import { AppContext } from "../../app-context";

/**
 * Represents a module exposing endpoints related to account management.
 */
export class AccountModule extends AppModule
{
    /**
     * Creates a new user with the specified name, email and password.
     * @param context.request.body.fullName The full name of the user.
     * @param context.request.body.preferredName The preferred name of the user.
     * @param context.request.body.email The email identifying the user.
     * @param context.request.body.password The password specified by the user.
     * @param context.request.body.confirmEmailUrl The URL for the "Confirm email" page.
     * @returns
     * - 204: No content
     *   The client may now authenticate using the email and password.
     *   An email will be sent to the user, with a link they can use to confirm their email address.
     *   Note that the email template will be selected based on the API key specified in the request.
     */
    public "POST /v2/account/create" = async (context: AppContext) =>
    {
        await this.apiClient.post("identity/account/signup",
        {
            body:
            {
                fullName: context.request.body.fullName,
                preferredName: context.request.body.preferredName,
                email: context.request.body.email,
                password: context.request.body.password,
                confirmEmailUrl: context.request.body.confirmEmailUrl
            }
        });

        context.response.status = 204;
    }

    /**
     * Confirms the email address of a user, by verifying the specified token.
     * @param context.request.body.token The token specified in the confirmation link sent to the user.
     * @returns
     * - 204: No content
     *   The client may now show a sign-in view, if not already authenticated.
     */
    public "POST /v2/account/confirm-email" = async (context: AppContext) =>
    {
        await this.apiClient.post("identity/account/confirmuseraccount",
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
     * @param context.request.body.email The email address identifying the user.
     * @param context.request.body.changePasswordUrl The URL for the "Change password" page.
     * @returns
     * - 204: No content
     *   An email will be sent to the user, with a link they can use to change their password.
     *   Note that the email template will be selected based on the API key specified in the request.
     */
    public "POST /v2/account/forgot-password" = async (context: AppContext) =>
    {
        await this.apiClient.post("identity/account/forgotpassword",
        {
            body:
            {
                userEmail: context.request.body.email,
                changePasswordUrl: context.request.body.changePasswordUrl
            }
        });

        context.response.status = 204;
    }

    /**
     * Changes the password for the user identified by the specified token.
     * @param context.request.body.password The new password chosen by the user.
     * @param context.request.body.token The token specified in the recovery link sent to the user.
     * @returns
     * - 200: The email address of the user for which the password was changed.
     *   The client may now authenticate using the email and password.
     */
    public "POST /v2/account/forgot-password/change-password" = async (context: AppContext) =>
    {
        const result = await this.apiClient.post("identity/account/changeuserpassword",
        {
            body:
            {
                passwordJwtToken: context.request.body.token,
                newPassword: context.request.body.newPassword,
                invalidateTokens: true
            }
        });

        context.response.body =
        {
            email: result.data.userEmail
        };

        context.response.status = 200;
    }

    /**
     * Changes the password for the current user, or the user identified by the specified token.
     * @param context.request.body.currentPassword The new password chosen by the user.
     * @param context.request.body.newPassword The token specified in the recovery link sent to the user, or undefined if already authenticated.
     * @returns
     * - 200: No content
     */
    public "POST /v2/account/change-password" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.put("identity/account/profile/password",
        {
            body:
            {
                currentPassword: context.request.body.currentPassword,
                newPassword: context.request.body.newPassword
            }
        });

        context.response.status = 204;
    }

    // TODO:BACKEND: Endpoint missing
    /**
     * Deletes the current user.
     * @returns
     * - 204: No content
     */
    public "POST /v2/account/delete" = async (context: AppContext) =>
    {
        await context.authorize();

        await this.apiClient.post("identity/account/delete",
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
            pictureUrl: result.data.pictureUrl,
            settings:
            {
                localeCode: result.data.settings.locale,
                currencyCode: result.data.settings.currency,
                themeSlug: result.data.settings.themeSlug
            }
        };

        context.response.status = 200;
    }

    /**
     * Saves the profile for the current user.
     * @param context.request.body The profile to save.
     * @param context.request.body.confirmEmailUrl The URL for the "Confirm email" page.
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
                pictureUrl: context.request.body.pictureUrl,
                confirmEmailUrl: context.request.body.confirmEmailUrl,
                settings:
                {
                    locale: context.request.body.settings.localeCode,
                    currency: context.request.body.settings.currencyCode,
                    themeSlug: context.request.body.settings.themeSlug
                }
            }
        });

        context.response.status = 204;
    }
}
