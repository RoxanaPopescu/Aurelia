# Package: `frontend`

### This represents the frontend for the Mover logistics platform

---

# Getting started

> Note that the instructions in the `readme.md` for the repository must be completed first.

## Install dependencies

1. **Install NPM dependencies**

   In a terminal in this folder, execute the commands:

   ```
   npm ci
   ```

   This will install the dependencies listed in the `package-lock.json` file.

   > Note that you must use `npm i` in the legacy folder, as it otherwise won't run `patch-package` during install.

   > If you encounter errors related to `node-gyp`, [this may help](https://github.com/nodejs/node-gyp/issues/629).

## Build and debug

1. **Start the `develop` package task, which builds, watches and serves the project**

   * In a terminal in this package folder, execute the command:

     ```
     npm run develop 

2. **The app should now be available on http://localhost:8080**

   Use the `Chrome` browser to test and debug the app.


# Package structure

The following is an overview of the package structure. It is conceptually simple, relying on a few well defined structural patterns, repeated in a recursive fashion. A structure like this will often look much like the view hierarchy of the app itself, making it very easy to navigate, understand and reason about.

## General guidelines

When deciding where to place something, always strive to place it as close to where it is used as possible, and then move it up in the structure only if it later becomes needed elsewhere. And if that does happen, always ask yourself whether you really need all of this, or only part of it. If the answer is the latter, you might want to consider refactoring, so only the relevant parts move up the structure, while the rest remains where it belongs, close to where it is needed.

A good test for whether the structure is in a good state, is to ask yourself "what would happen if I delete this module or component? What else would I need to clean up?". Ideally, the answer should be only a few references or route definitions. If you find any other files or folders need to be deleted, those should probably have been inside the module or component.

A side effect of this is, that a few components and services will tend to work their way up, towards the root of the structure, as they become needed in more and more places. And while this does separate them slightly from where they are used, that's fine - it's just a consequence of their shared nature, so don't stress about it. And of course, if you happen to have a large, shared component, that is not tightly coupled to the domain of the app, such as e.g. a complex markdown editor, you could always consider splitting that out into an entirely separate package.

### Naming conventions

All file and folder names must be lower case and the only word separator allowed is a single `-`.
The only exceptions are tests, which must be named `{name}.test.ts`, and localized files, which must be named `{name}.{locale}.{ext}`.

In the following, `-` and `+` indicate expanded and collapsed folders.

## Structure of the package and `src` folder

```
.
├ - packages
│   ├ + cloud
│   ├ + desktop
│   └ + mobile
├ - src
│   ├ - app
│   │   ├ + components
│   │   ├ + modules
│   │   ├ + resources
│   │   ├ + services
│   │   ├   app.html
│   │   ├   app.scss
│   │   └   app.ts
│   ├ - resources
│   │   ├ + experiments
│   │   ├ + integration
│   │   ├ - locales
│   │   │   ├   locale.ts
│   │   │   ├   locale.{locale}.ts
│   │   │   └   ...
│   │   ├ - settings
│   │   │   ├   settings.ts
│   │   │   └   ...
│   │   ├ - styles
│   │   │   ├ + framework
│   │   │   ├ + resources
│   │   │   └ + settings
│   │   │       └   index.scss
│   │   ├ - themes
│   │   │   └ + ...
│   │   └ - translations
│   │       ├   translations.json
│   │       ├   translations.{locale}.json
│   │       └   ...
│   ├ - shared
│   │   ├ - framework
│   │   │   ├ + components
│   │   │   ├ + services
│   │   │   ├ + styles
│   │   │   │   ├ - base
│   │   │   │   │   ├ + foundation
│   │   │   │   │   ├ + framework
│   │   │   │   │   ├ + resources
│   │   │   │   │   ├ + settings
│   │   │   │   │   └   index.scss
│   │   │   ├   index.scss
│   │   │   ├   index.ts
│   │   │   └   readme.md
│   │   ├ - infrastructure
│   │   │   ├ + ...
│   │   │   ├   index.ts
│   │   │   └   readme.md
│   │   ├ - patches
│   │   │   ├ + ...
│   │   │   ├   index.ts
│   │   │   └   readme.md
│   │   ├ - types
│   │   │   ├ + ...
│   │   │   ├   index.ts
│   │   │   └   readme.md
│   │   └ - utilities
│   │       ├ + ...
│   │       ├   index.ts
│   │       └   readme.md
│   ├ + typings
│   ├   env.ts
│   ├   index.html
│   ├   index.scss
│   └   index.ts
├ + tools
├   package.json
├   readme.md
└   tsconfig.json
```

#### Contents of the `./packages` folder:

This contains packages that act as hosts for the app. For example, the `cloud` package might implement a Node Express server, while the `desktop` package might implement an Electron app, and the `mobile` might implement a Cordova app. Note that you generally won't need those packages while developing the app itself, as development should happen using a simple development server.

#### Contents of the `./src/app` folder:

This is a `module` folder, representing the root app module.

### Structure of a `module` folder

> Note that for very large apps, modules could be broken out as separate packages, maintained by separate teams.

A module represents a view with an associated route, usually presented in a `<router-view>`.
It should be as self-contained as possible, and may contain sub-modules, each structured in the same way.

```
- {module-name}
  ├ + components
  ├ + modules
  ├ + resources
  ├ + services
  ├   {module-name}.html
  ├   {module-name}.scss
  ├   {module-name}.ts
  └   routes.ts
```

### Structure of a `component` folder

> Note that you may use sub-folders under the `components` folder to group closely related `component` folders. Use this if you have e.g. multiple variations of some card component, and want to group them together.

A component represents a a custom element or attribute used within a view.
It should be as self-contained as possible, and may contain sub-components, each structured in the same way.

Sub-components are components that are used internally in the template for the component, but which are not exposed to consumers. For example, while a `page-header` component might internally use a `logo` component, that is an implementation detail the consumer don't need to know about.

Some components may need to expose related components. For example, a `tabs` component might expose both a `tabs` and `tab-pane` component, both of which are needed to consume the component as a whole. In such cases, the files for the related components should be placed together with the files for the primary component.

```
- {component-name}
  ├ + components
  ├ + resources
  ├ + services
  ├   {component-name}.html
  ├   {component-name}.scss
  ├   {component-name}.ts
  ├   {optional-related-component-name}.html
  ├   {optional-related-component-name}.scss
  ├   {optional-related-component-name}.ts
  └   ...
```

### Structure of a `service` folder

> Note that you may use sub-folders under the `services` folder to group closely related `service` folders. Use this to separate services for the distinct domains within the app.

Services are injected into view models, allowing the view models to contain only interaction logic and temporary state scoped to that view. We generally distinguish between two types of services:
* Service that implements and manage a core part of the domain model for the app
* Services that implements and manage state that is specific to some module or component.

Services should be carefully architected to separate concerns, and should be as self contained as possible, with each service exposing its public API through a single `index.ts` file. Prefer creating more specialized services, rather than creating a few services that take on too many responsibilities.

### Structure of a `resources` folder

A `resources` folder may exist at the root level, module level and component level, as well as under services. Resources represent _assets_, such as images, icons, videos and fonts, as well as things that could be said to be _consumed_ by the module or component, such as settings, or localizable things, such as `.json` files containing strings for use in models and services.

```
- resources
  ├ + fonts
  ├ + icons
  ├ + images
  ├ + settings
  ├ + strings
  ├ + videos
  └ + ...
```

Note that the `resources` folder at the root level has slightly different content.
