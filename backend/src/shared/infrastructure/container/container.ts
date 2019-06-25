import "reflect-metadata";
import { Type } from "../types";
import { IDisposable } from "../types/disposable";

/**
 * Decorator that must be applied to classes, in order to enable dependency injection.
 */
// tslint:disable-next-line:ban-types
export function inject(constructor: Function): void
{
    // Empty, as metadata generation is triggered simply by the presence of a decorator.
}

/**
 * Represents a dependency injection container.
 */
export class Container implements IDisposable
{
    private readonly _container = new Map<Type, any>();

    /**
     * Adds the specified instance to the container, using its type as key.
     * @param instance The instance to add.
     * @returns The dependency injection container.
     */
    public add(instance: object): this;

    /**
     * Adds the specified instance to the container, using the specified key.
     * @param key The key to use.
     * @param instance The instance to add.
     * @returns The dependency injection container.
     */
    public add<T>(key: Type<T>, instance: T): this;

    /**
     * Adds the specified type to the container, itself as key.
     * @param type The type to add.
     * @returns The dependency injection container.
     */
    public add(type: Type): this;

    /**
     * Adds the specified type to the container, using the specified key.
     * @param key The key to use.
     * @param type The type to add.
     * @returns The dependency injection container.
     */
    public add<T>(key: Type<T>, type: Type<T>): this;

    public add(...args: any[]): this
    {
        if (args[0] == null || args.length > 1 && args[1] == null)
        {
            throw new Error("Invalid arguments.");
        }

        const key = args[0] instanceof Function ? args[0] : args[0].constructor;
        const value = args.length === 1 ? args[0] : args[1];

        if (value instanceof Function)
        {
            const resolver = this.createResolver(value);
            this._container.set(key, resolver);
        }
        else
        {
            this._container.set(key, value);
        }

        return this;
    }

    /**
     * Determines whether the specified key exists in the container.
     * @param key The key to look for.
     * @returns True if the key was found, otherwise false.
     */
    public has(key: Type): boolean
    {
        return this._container.has(key);
    }

    /**
     * Removes the the specified key from the container.
     * @param key The key to remove from the container.
     * @returns The dependency injection container.
     */
    public remove(key: Type): this
    {
        this._container.delete(key);

        return this;
    }

    /**
     * Resolves an instance for the specified key.
     * @param key The key for which an instance should be resolved.
     * @returns An instance for the specified key.
     */
    public get<T>(key: Type<T>): T
    {
        if (key == null)
        {
            throw new Error("Invalid arguments.");
        }

        let value = this._container.get(key);

        if (value == null)
        {
            throw new Error(`Could not find the type '${key.name}' in the container.`);
        }

        if (value instanceof Function)
        {
            value = value();
            this._container.set(key, value);
        }

        return value;
    }

    /**
     * Disposes the container, and all instances managed by it.
     */
    public dispose(): void
    {
        for (const value of this._container.values())
        {
            if (value.dispose instanceof Function)
            {
                value.dispose();
            }
        }
    }

    /**
     * Creates a function that resolves a new instance of the specified type,
     * resolving any dependencies needed from the container.
     * @param type The type for which a resolver should be created.
     * @returns A function that resolves a new instance of the specified type.
     */
    private createResolver<T>(type: Type<T>): () => T
    {
        const metadata = Reflect.getMetadata("design:paramtypes", type);

        if (metadata != null)
        {
            return () => new type(...metadata.map((t: Type) => this.get(t)));
        }

        if (type.length > 0)
        {
            throw new Error(`No metadata found on type '${type.name}' registered in the container. Are you missing a decorator?`);
        }

        return () => new type();
    }
}

/**
 * The default container instance.
 */
export const container = new Container();
