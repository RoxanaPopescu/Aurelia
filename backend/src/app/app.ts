import * as express from "express";
import { environment } from "../env";

// The port to which the server should bind.
const port = parseInt(process.env.PORT || "8008");

/**
 * Represents the app.
 */
export class App
{
    /**
     * Creates a new instance of the type.
     */
    public constructor()
    {
        // Create the server.
        this._app = express();

        // Handle requests.
        this._app.all("*", (request, response) =>
        {
            response.json(
            {
                "environment": environment.name,
                "request":
                {
                    "method": request.method,
                    "url": request.originalUrl,
                    "headers": request.headers
                }
            });
        });
    }

    private readonly _app: express.Express;

    /**
     * Starts the app.
     */
    public start(): void
    {
        // Start the server.
        this._app.listen(port, () =>
        {
            console.info(`Server running in '${environment.name}' environment, listening on port ${port}`);
        });
    }
}
