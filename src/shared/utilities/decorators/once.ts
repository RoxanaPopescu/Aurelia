/**
 * Decorator applicable to classes, methods and property setters.
 * Enforces that the constructor, method or setter to which it is applied should only be called once,
 * throwing an error on any subsequent calls.
 */
export function once<T>(target: any, key?: any, descriptor?: any): any
{
    if (target instanceof Function)
    {
        let called = false;

        // Store a reference to the original constructor.
        const oldConstructor = target;

        // Define the new constructor.
        const newConstructor = function(this: any): any
        {
            // tslint:disable: no-invalid-this

            if (called)
            {
                throw new Error(`The class '${target.name}' may only be constructed once.`);
            }

            called = true;

            // Call the original constructor to create the instance.
            return oldConstructor.apply(this, arguments) as T;

            // tslint:enable
        };

        // Copy the prototype so `intanceof` operator still works as expected.
        newConstructor.prototype = oldConstructor.prototype;

        // Return the new constructor.
        return newConstructor as any;
    }

    if (key != null && descriptor != null && typeof (descriptor.value || descriptor.set) === "function")
    {
        const called = new WeakMap();

        if (descriptor.value != null)
        {
            // Store a reference to the original method.
            const oldMethod = descriptor.value;

            // Define the new method.
            descriptor.value = function(this: any): void
            {
                // tslint:disable: no-invalid-this

                if (called.get(this))
                {
                    throw new Error(`The method '${key.toString()}' on class '${target.constructor.name}' may only be called once`);
                }

                called.set(this, true);

                // Call the original method.
                oldMethod.apply(this, arguments);

                // tslint:enable
            } as any;
        }
        else if (descriptor.set != null)
        {
            // Store a reference to the original setter.
            const oldSetter = descriptor.set;

            // Define the new setter.
            descriptor.set = function(this: any): void
            {
                // tslint:disable: no-invalid-this

                if (called.get(this))
                {
                    throw new Error(`The setter '${key.toString()}' on class '${target.constructor.name}' may only be called once`);
                }

                called.set(this, true);

                // Call the original setter.
                oldSetter.apply(this, arguments);

                // tslint:enable
            };
        }

        // Return the descriptor.
        return descriptor;
    }

    throw new SyntaxError("Only constructors, methods and setters can be marked as callable only once.");
}
