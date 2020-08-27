const path = require("path");
import { app, BrowserWindow, Menu, ipcMain } from "electron";
const PDFWindow = require('electron-pdf-window');
import { environment } from "./env";

// The locale code for the client build that should be served.
const localeCode = "en-US";

// The path for the localized `build` artifact copied from the `frontend` package.
const clientFolderPath = path.join(__dirname, "./client", localeCode);

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
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
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

            // Print pdf action
            ipcMain.on('print-pdf', (event, arg) => {
                try {

                    let url = arg.url;
                    let winPdf = new BrowserWindow({
                        parent: mainWindow,
                        width: 800,
                        height: 600,
                        webPreferences: { // You need this options to load pdfs
                            plugins: true
                        }
                    });
                    PDFWindow.addSupport(winPdf);

                    winPdf.loadURL(url);

                    winPdf.webContents.on('did-finish-load', () => {
                        setTimeout(() => {
                            const options = { silent: true, printBackground: true };

                            winPdf.webContents.print(options || {}, (success) => {
                                if (success) {
                                  console.log('Finished printing with success');
                                } else {
                                  console.error('Finished printing with error');
                                }
                                winPdf.close();
                            })
                        }, 3000);
                    });



                } catch {
                    // Do nothing
                }
            });
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
