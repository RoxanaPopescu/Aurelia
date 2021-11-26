import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the `ipcRenderer` without exposing the entire object.
contextBridge.exposeInMainWorld("ipc",
{
    /**
     * Send an asynchronous message to the main process via the specified channel.
     * @param channel The name of the channel on which to send the message.
     * @param message The message to send.
     */
    send: (channel: string, message: any) =>
    {
        ipcRenderer.send(channel, message);
    },

    /**
     * Listens for asynchronous messages from the main process via the specified channel.
     * @param channel The name of the channel on which to listen for messages.
     * @param func The function to call when a message is received.
     */
    on: (channel: string, func: (message: any) => void) =>
    {
        // Deliberately strip event as it includes `sender`.
        ipcRenderer.on(channel, (event, message) => func(message));
    }
});
