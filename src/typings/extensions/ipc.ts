// tslint:disable-next-line: interface-name
interface Window
{
    /**
     * Provides methods for inter-process communacation with the host process,
     * when the app is packaged as a desktop app. Not that this will be undefined
     * when not host process exists.
     */
    ipc?:
    {
        /**
         * Send an asynchronous message to the main process via the specified channel.
         * @param channel The name of the channel on which to send the message.
         * @param message The message to send.
         */
        send: (channel: string, message: any) => void;

        /**
         * Listens for asynchronous messages from the main process via the specified channel.
         * @param channel The name of the channel on which to listen for messages.
         * @param func The function to call when a message is received.
         */
        on: (channel: string, func: (message: any) => void) => void;
    };
}
