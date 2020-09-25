/**
 * Represents a typed Web Worker, loaded by Webpack.
 * See: https://github.com/webpack-contrib/worker-loader
 *
 * Note that when importing this into a worker, you must import import directly from this file,
 * not from the `index` file of the `infrastructure` folder. This is required to avoid pulling
 * in other things that are not compatible with web workers.
 */
export class TypedWorker<TMessage> extends Worker
{
    public constructor()
    {
        // Ensure this class is never instantiated.
        // This is needed because this class is only intended to provide type safety during development.
        // When the worker is loaded by the `worker-loader`, it wraps the worker in an instance of its own class.
        throw new Error("This class cannot be instantiated.");

        super("");
    }

    // tslint:disable: ban-ts-ignore

    // @ts-ignore
    public onmessage: (this: TypedWorker<TMessage>, event: IMessageEvent<TMessage>) => any;

    // @ts-ignore
    public postMessage(this: TypedWorker<TMessage>, message: TMessage, transferList?: ArrayBuffer[]): any;

    // @ts-ignore
    public addEventListener(type: "message", listener: (this: TypedWorker<TMessage>, event: IMessageEvent<TMessage>) => any, useCapture?: boolean): void;

    // @ts-ignore
    public addEventListener(type: "error", listener: (this: TypedWorker<TMessage>, event: ErrorEvent) => any, useCapture?: boolean): void;

    // tslint:enable
}

/**
 * Represents a message sent to or from a typed Web Worker.
 * Note that the data specified here must support JSON serialization.
 */
export interface IMessageEvent<TMessage> extends MessageEvent
{
    data: TMessage;
}
