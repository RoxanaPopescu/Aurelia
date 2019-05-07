    import { autoinject, BindingLanguage, Expression, ViewResources, createOverrideContext } from "aurelia-framework";

    // Represents the sequence of static and dynamic parts resulting from parsing a text.
    type TemplateStringParts = (Expression | string)[];

    // Cache containing parsed template string parts, using the parsed text as key.
    const cache = new Map<string, TemplateStringParts>();

    /**
     * Represents an interpolation expression, such as "The price is ${price | currency}",
     * which when evaluated against a binding context results in a formatted string,
     * such as "The price is 42 USD".
     */
    @autoinject
    export class TemplateString
    {
        /**
         * Creates a new instance of the type.
         * @param text The text representing the interpolation expression.
         * @param viewResources The view resources to use when evaluating the interpolation expression.
         * @param bindingLanguage The `BindingLanguage` instance.
         */
        public constructor(text: string, viewResources: ViewResources, bindingLanguage: BindingLanguage)
        {
            this._text = text;
            this._viewResources = viewResources;
            this._bindingLanguage = bindingLanguage;
        }

        private readonly _text: string;
        private readonly _viewResources: ViewResources;
        private readonly _bindingLanguage: BindingLanguage;

        /**
         * Evaluates the interpolation expression against the specified context.
         * @param bindingContext The context against which expressions should be evaluated.
         * @param overrideContext The override context against which expressions should be evaluated.
         * @returns The string resulting from evaluating the interpolation expression.
         */
        public evaluate(bindingContext?: any, overrideContext?: any): string
        {
            let parts = cache.get(this._text);

            if (parts == null)
            {
                parts = ((this._bindingLanguage as any)
                    .parseInterpolation(null, this._text) || [this._text]) as (Expression | string)[];

                cache.set(this._text, parts);
            }

            const scope =
            {
                bindingContext: bindingContext || {},
                overrideContext: overrideContext || createOverrideContext(bindingContext)
            };

            const lookupFunctions = (this._viewResources as any).lookupFunctions;

            return parts.map(expression =>
            {
                if (typeof expression === "string")
                {
                    return expression;
                }

                return expression.evaluate(scope, lookupFunctions);

            }).join("");
        }

        /**
         * Gets the string representation of this template string.
         * @returns The string from which the template string was created.
         */
        public toString(): string
        {
            return this._text;
        }
    }

    /**
     * Represents a parser that parses strings representing interpolation expressions,
     * such as "The price is ${price | currency}".
     */
    @autoinject
    export class TemplateStringParser
    {
        /**
         * Creates a new instance of the type.
         * @param resources The view resources to use when evaluating expressions.
         * @param bindingLanguage The `BindingLanguage` instance.
         */
        public constructor(resources: ViewResources, bindingLanguage: BindingLanguage)
        {
            this._resources = resources;
            this._bindingLanguage = bindingLanguage;
        }

        private readonly _resources: ViewResources;
        private readonly _bindingLanguage: BindingLanguage;

        /**
         * Parses the specified text as an interpolation expression.
         * @param text The text representing the interpolation expression.
         * @returns A TemplateString instance representing the interpolation expression.
         */
        public parse(text: string): TemplateString
        {
            return new TemplateString(text, this._resources, this._bindingLanguage);
        }
    }
