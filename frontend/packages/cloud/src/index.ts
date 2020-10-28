import { App } from "./app/app";

const app = new App();

app.start();

process.on("SIGINT", () =>
{
    console.info("Process received signal 'SIGINT'. Stopping server...");

    app.stop();
});
