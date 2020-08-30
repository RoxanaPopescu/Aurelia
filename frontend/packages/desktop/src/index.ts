// tslint:disable: no-floating-promises

import fs from "fs";
import path from "path";
import { app, protocol, ipcMain, BrowserWindow, Menu } from "electron";
import { environment } from "./env";
import PdfWindow from "electron-pdf-window";

// The path for the folder containing the localized `build` artifacts copied from the `frontend` package.
const frontendFolderPath = path.join(__dirname, "frontend");

// The main window.
let mainWindow: Electron.BrowserWindow;

// True if the app is in the process of quitting, otherwise false.
let isQuitting = false;

app.on("ready", () =>
{
    // Get the locale code for the frontend build to load.
    const localeCode = getLocaleCode(app.getLocale(), "en-US");

    // Intercept requests using the `file` protocol.
    protocol.interceptFileProtocol("file", (request, callback) =>
    {
        console.log("Responding to file request:", request.url);

        // Get the URL path, by removing the protocol and any query or fragment.
        const urlPath = request.url.substring("file://".length).replace(/[?#].*/, "");

        // Respond with the file from the app package.
        callback({ path: path.join(frontendFolderPath, localeCode, urlPath)});
    });

    // Create the main window.
    createWindow();
});

app.on("before-quit", () =>
{
    // Set the flag that indicates the app is quitting, so it can respond accordingly.
    isQuitting = true;
});

app.on("activate", () =>
{
    // If the platform is macOS, show the main window when the dock icon is clicked.
    if (process.platform === "darwin")
    {
        // Show the main window.
        mainWindow.show();
    }
});

app.on("window-all-closed", () =>
{
    // If the platform is not macOS, quit the app when the last window is closed.
    if (process.platform !== "darwin")
    {
        // Quit the app.
        app.quit();
    }
});

/**
 * Creates the main window.
 */
function createWindow(): void
{
    if (!environment.debug)
    {
        // Hide the menu bar if debugging is disabled.
        Menu.setApplicationMenu(null);
    }

    // Create the main window.
    mainWindow = new BrowserWindow(
    {
        width: 1280,
        height: 720,
        show: false,
        webPreferences:
        {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    // Should the app launch with the devtools open?
    if (environment.devTools)
    {
        // Wait for the devtools to open, before loading the app.
        mainWindow.webContents.on("devtools-opened", () =>
        {
            // Load the app.
            mainWindow.loadURL("file:index.html");
        });

        // Open the devtools.
        mainWindow.webContents.openDevTools();
    }
    else
    {
        // Load the app.
        mainWindow.loadURL("file:index.html");
    }

    mainWindow.on("ready-to-show", () =>
    {
        // Print PDF action.
        ipcMain.on("print-pdf", (event, arg) =>
        {
            try
            {
                const url = arg.url;

                const winPdf = new BrowserWindow(
                {
                    parent: mainWindow,
                    width: 800,
                    height: 600,
                    webPreferences:
                    {
                        // You need this options to load PDFs.
                        plugins: true
                    }
                });

                PdfWindow.addSupport(winPdf);

                winPdf.loadURL(url);

                winPdf.webContents.on("did-finish-load", () =>
                {
                    setTimeout(() =>
                    {
                        const options = { silent: true, printBackground: true };

                        winPdf.webContents.print(options || {}, success =>
                        {
                            if (success)
                            {
                              console.log("Finished printing with success");
                            }
                            else
                            {
                              console.error("Finished printing with error");
                            }

                            winPdf.close();
                        });

                    }, 3000);
                });

            }
            catch
            {
                // Do nothing.
            }
        });

        // Show the main window.
        mainWindow.show();
    });

    mainWindow.on("close", event =>
    {
        // If the platform is macOS, hide the window instead of closing it.
        if (process.platform === "darwin" && !isQuitting)
        {
            // Hide the main window.
            mainWindow.hide();

            // Prevent the window from being destroyed.
            event.preventDefault();
        }
    });
}

/**
 * Gets the locale code for the localized build to load, taking into account the specified preferred locale codes.
 * @param preferredLocaleCodes The preferred locale codes, ordered by descending priority.
 * @returns The locale code for the build to load.
 */
function getLocaleCode(...preferredLocaleCodes: string[]): string
{
    console.log("Resolving locale code...");

    // Get all the supported locale codes, ordered by ascending specificity.
    const supportedLocaleCodes = fs.readdirSync(frontendFolderPath)
        .filter(name => fs.lstatSync(path.join(frontendFolderPath, name)).isDirectory());

    console.log("Preferred locale coddes:", preferredLocaleCodes);
    console.log("Supported locale coddes:", supportedLocaleCodes);

    // If only a single locale code is supported, return that.
    if (supportedLocaleCodes.length === 1)
    {
        console.info("Resolved locale codde:", supportedLocaleCodes[0]);

        return supportedLocaleCodes[0];
    }

    // Try to find the supported locale code that best matches one of the preferred locale codes.
    for (const preferredLocaleCode of preferredLocaleCodes)
    {
        // Split the preferred locale code into segments.
        const preferredLocaleCodeParts = preferredLocaleCode.split("-");

        // Try to find a supported locale code that is compatible with the preferred locale code,
        // iteratively reducing the specificity of the preferred locale code after each attempt.
        while (preferredLocaleCodeParts.length > 0)
        {
            const partialPreferredLocaleCode = preferredLocaleCodeParts.join("-");

            const matchingLocaleCode = supportedLocaleCodes.find(supportedLocaleCode =>
                supportedLocaleCode === partialPreferredLocaleCode || supportedLocaleCode.startsWith(`${partialPreferredLocaleCode}-`));

            if (matchingLocaleCode)
            {
                console.info("Resolved locale codde:", matchingLocaleCode);

                return matchingLocaleCode;
            }

            preferredLocaleCodeParts.pop();
        }
    }

    throw new Error("Could not resolve the locale code to use.");
}
