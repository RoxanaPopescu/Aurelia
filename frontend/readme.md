# Package: `frontend`

### This represents the frontend for the Mover logistics platform

---

# Getting started

> Note that the steps for the repository must be completed first.

## Build and debug

1. **Start the `develop` package task, which builds, watches and serves the project**

   There are two ways to do this:

   * In `Visual Studio Code`, start the default build task.

     >  Note that on `macOS`, the shortcut is `Command + Shift + B`.

     >  Note that on `Windows`, the shortcut is `Control + Shift + B`.

   * In a terminal in this package folder, execute the command:

     ```
     npm run develop
     ```

2. **The app should now be available on http://localhost:8080**

   Use the `Chrome` browser to test and debug the app.

   > Note that you can also start debugging in `Visual Studio Code`, using the `Debug` configuration.

## Additional tasks


* **Translate to Danish**

  As a temporary solution to support Danish translations, we have a script that updates the
  Danish translation file, removing any unused strings and adding any new, English strings.
  It is then the responsibility of the developer to look at the file diff before comitting,
  and to translate any new strings to Danish.

  > Please study the documentation for
  > [gulp-translate](https://www.npmjs.com/package/gulp-translate),
  > to make sure you understand how things work.

  In a terminal in this package folder, execute the command:

  ```
  npm run translate
  ```

  This will update the file `src/resources/translations/da.json`.

* **Lint the project**

  In a terminal in this package folder, execute the command:

  ```
  npm run lint
  ```

  This will log any lint errors or warnings to the terminal.

* **Remove existing `build` artifacts**

  In a terminal in this package folder, execute the command:

  ```
  npm run clean
  ```

  This will remove any existing `build` artifacts, as preparation for new builds.

* **Build for specific locale, platform and environment**

  > Note that you should remove existing `build` artifacts before building the new ones.

  In a terminal in this package folder, execute the command:

  ```
  npm run build -- --locale={locale} --platform={platform} --environment={environment}
  ```

  Where:

  * `{locale}` should be replaced with the locale code for which to build.

  * `{platform}` should be replaced with either `cloud` or `desktop`.

  * `{environment}` should be replaced with either `development`, `preview` or `production`.


  This will produce a `build` artifact for the specified locale, to be served by one of the app packages.

* **Debug a build script**

  Start debugging in `Visual Studio Code`, using the `Debug script` configuration.

  > Note that a picker will be shown, asking which script to debug.

* **Export strings for translation**

  In a terminal in this package folder, execute the command:

  ```
  npm run translate-export
  ```

  This will produce a `translate/export` artifact, which may be uploaded to a translation management system.

* **Produce a pseudo-translation of the exported strings**

  In a terminal in this package folder, execute the command:

  ```
  npm run translate-pseudo
  ```

  This will produce a translation file for the custom locale `x-pseudo`, which is based on the exported strings, but mutated so it can be used during testing, e.g. to help identify missing `translate` annotations.

---

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

#### Contents of the `./src/shared` folder:

> Note that this could be broken out into separate packages, shared between multiple projects.

* The `framework` folder, containing shared components and styles.
This should be implemented such that it could theoretically be reused in other apps without changes.
Note that you should never import anything from this folder, other than `index.ts` and `index.scss`.

* The `infrastructure` folder, containing shared infrastructure code.
This should be implemented such that it could theoretically be reused in other apps without changes.
Note that you should never import anything from this folder, other than `index.ts`.

* The `patches` folder, containing any monkey-patches needed to patch issues found in dependencies.

* The `types` folder, containing shared types that are not specific to the app.
This should be implemented such that it could theoretically be reused in other apps without changes.
Note that you should never import anything from this folder, other than `index.ts`.

* The `utilities` folder, containing shared utilities that are not specific to the app.
* This should be implemented such that it could theoretically be reused in other apps without changes.
Note that you should never import anything from this folder, other than `index.ts`.

#### Contents of the `./src/resources` folder:

* The `experiments` folder, containing the settings and implementations of any experiments being conducted. Each experiment must be implemented in its own folder.

* The `integration` folder, containing any files needed to integrate with browsers, devices or services.
An example of this would be the `favicon.ico` file, manifests and similar resources.

* The `locales` folder, containing files that define the formatting settings for each locale.
Only the one matching the current locale will be loaded by the app.

* The `settings` folder, containing the settings for the app, infrastructure and framework. Note that feature settings should live in the individual modules and components. This is primarily intended for fundamental settings, such as API base URL's, supported markets and locales, etc.

* The `styles` folder, containing app-specific styles used across the app. This is structured similar to the shared styles.

* The `themes` folder, containing app-specific themes, each in its own folder, including any associated resources.

* The `translations` folder, containing files that provide the translated content that is injected into view templates and string files during the localization process. Those files will be imported from a translation management system and should therefore not be edited manually. For more information, see [gulp-translate](https://www.npmjs.com/package/gulp-translate).

#### Contents of the `./src/tools` folder:

This contains any tools needed for development, such as build scripts.

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

### Structure of an `experiment`folder

An experiment is any kind of test we wish to perform, e.g. to evaluate the user and business impact of a new design for some component. Experiments have two parts:
* An `experiment` folder, which contains the implementation of any framework configuration, components, or services needed for the experiment.
* The code that imports and integrates the experiment in the affected parts of the app.

Conceptually, the idea is, that essentially all code related to the experiment lives in this folder, and only if the experiment proves to be a success, will time be allocated to implement it properly in the app itself. This allows experiments to be created with less concern for long term maintainability, and more of a copy-paste-modify approach, as they won't pollute the code base for the app itself - at least not beyond a few simple condition to use e.g. an alternative component implementation provided by the experiment. And when an `experiment` folder is deleted, build errors will reveal all the places in which it was integrated, making cleanup easier.

An `experiment` folder must be structured exactly like this, and the index file must export a `configure` function, so they can be loaded and configured as features in Aurelia:

```
- {experiment-name}
  ├ + components
  ├ + resources
  ├ + services
  ├   index.ts
  └   readme.md
```
---
