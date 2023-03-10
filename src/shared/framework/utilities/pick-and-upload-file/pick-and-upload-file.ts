import { Container } from "aurelia-framework";
import { MapObject } from "shared/types";
import { Operation } from "shared/utilities";
import { ApiClient, ApiResult } from "shared/infrastructure/api-client";

/**
 * Represents a file upload request.
 */
export interface IFileUploadRequest<TResult = any>
{
    /**
     * The upload operation.
     */
    operation: Operation<ApiResult<TResult>>;

    /**
     * The file being uploaded.
     */
    file: Blob;
}

/**
 * Opens a file picker, and if a file is picked, uploads it to the specified URL.
 * @param method The HTTP method to use.
 * @param path The path, or path segments, identifying the endpoint to which the file should be uploaded.
 * @param query The query parameters to associate with the request, if any.
 * @param accept The file type specifiers for the file types to accept.
 * @returns A promise that will be resolved if the user picks a file.
 */
export async function pickAndUploadFile<TResult = any>(method: string, path: string | string[], query?: MapObject, accept = "*"): Promise<IFileUploadRequest<TResult>>
{
    const apiClient = Container.instance.get(ApiClient);

    return new Promise((resolve, reject) =>
    {
        const form = document.createElement("form");
        form.setAttribute("enctype", "multipart/form-data");
        form.setAttribute("style", "display: none");

        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("name", "file");
        input.setAttribute("accept", accept);

        form.appendChild(input);

        input.addEventListener("change", () =>
        {
            const operation = new Operation(async signal =>
            {
                return apiClient[method](path,
                {
                    body: new FormData(form),
                    query,
                    signal
                });
            });

            resolve({ operation, file: input.files![0] });

            document.documentElement.removeChild(form);
            done = true;
        });

        let done = false;
        document.documentElement.appendChild(form);
        setTimeout(() => done || document.documentElement.removeChild(form), 10 * 60 * 1000);

        input.click();
    });
}
