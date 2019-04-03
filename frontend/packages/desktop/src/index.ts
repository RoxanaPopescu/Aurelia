import path from "path";
import { app, BrowserWindow, Menu } from "electron";
import { environment } from "./env";

// The locale code for the client build that should be served.
const localeCode = "en-US";

// The path for the localized `build` artifact copied from the `frontend` package.
const clientFolderPath = path.join(__dirname, "../client", localeCode);

let mainWindow: Electron.BrowserWindow | undefined;

function createWindow(): void
{
    if (environment.name === "production")
    {
        Menu.setApplicationMenu(null);
    }

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false
    });

    if (environment.devTools)
    {
        mainWindow.webContents.openDevTools();

        mainWindow.webContents.on("devtools-opened", () =>
        {
            mainWindow!.loadFile(path.join(clientFolderPath, "index.html"));
        });
    }
    else
    {
        mainWindow.loadFile(path.join(clientFolderPath, "index.html"));
    }

    mainWindow.on("closed", () =>
    {
        mainWindow = undefined;
    });

    mainWindow.on("ready-to-show", () =>
    {
        if (mainWindow)
        {
            mainWindow.show();
        }
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", () =>
{
    if (process.platform !== "darwin")
    {
        app.quit();
    }
});

app.on("activate", () =>
{
    if (mainWindow === undefined)
    {
        createWindow();
    }
});
