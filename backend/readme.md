# Package: `backend`

### This represents the backend for the Mover logistics platform

---

# Getting started

> Note that the steps for the repository must be completed first.

## Install dependencies

1. **Install NPM dependencies**

   In a terminal in this folder, execute the command:

   ```
   npm ci
   ```

   This will install the dependencies listed in the `package-lock.json` file.

   > If you encounter errors related to `node-gyp`, [this may help](https://github.com/nodejs/node-gyp/issues/629).

## Build and debug

1. **Start the `develop` package task, which builds and watches the project**

   There are two ways to do this:

   * In `Visual Studio Code`, start the default build task.

     >  Note that on `macOS`, the shortcut is `Command + Shift + B`.

     >  Note that on `Windows`, the shortcut is `Control + Shift + B`.

   * In a terminal in this package folder, execute the command:

     ```
     npm run develop
     ```

2. **Start debugging in `Visual Studio Code`, using the `Debug` configuration**

   > Note that the app is automatically restarted after each build.

3. **The app should now be available on http://localhost:8008**

   Use the `REST Client` plugin for `Visual Studio Code` to test the app.

## Additional tasks

* **Translate the project**

  The following is the recommended workflow for manually updating translations.

  In a terminal in this package folder, execute the commands:

  ```
  npm run translate-export
  npm run translate-update
  ```

  This will export all translatable strings found in the application into a translation export file.
  This file is then used to update any existing translation import files, such that:
  - The order of the keys is the same as in the export file.
  - Any keys that exist in the import file, but not in the export file, are removed.
  - Any keys that exist in the export file, but not in the import file, are added with the source string as value.

  It is then the responsibility of the developer to look at the file diff before comitting the changes,
  and to translate any strings that were added. If a string cannot be translated before committing the changes,
  it must be removed, such that it will be added again next time the script is executed.

  Additionally, to generate a pseudo-translation import file, useful for testing, execute the command:

  ```
  npm run translate-pseudo
  ```

  Note that you can also execute all of the above, by simply executing the command:

  ```
  npm run translate
  ```

  > Please study the documentation for [gulp-translate](https://www.npmjs.com/package/gulp-translate),
  > to make sure you understand how this system works.

* **Lint the project**

  In a terminal in this package folder, execute the command:

  ```
  npm run lint
  ```

  This will log any lint errors or warnings to the terminal.

* **Build for production**

  In a terminal in this package folder, execute the command:

  ```
  npm run build
  ```

  This will remove any existing `build` artifacts, and then produce a new `build` artifact.

* **Start the production build**

  In a terminal in this package folder, execute the command:

  ```
  npm run start
  ```

  This will start the server using the default settings.

  Alternatively, if settings need to be specified, execute the command:

  ```
  NODE_ENV="{environment}" PORT="{port}" node "artifacts/build/server/index.js"
  ```

  Where:

  * `{environment}` should be replaced with either `development`, `preview` or `production`.<br>
    The default is `development`.

  * `{port}` should be replaced with the port on which the server should listen.<br>
    The default is `8008`.

  This will start the server using the specified settings.

  Note that for production use, it is recommended to use a process manager, such as [PM2](https://pm2.keymetrics.io/).

  To install this globally, execute the command:

  ```
  npm install pm2 -g
  ```

  To start an app cluster, execute the command:

  ```
  NODE_ENV="{environment}" PORT="{port}" pm2-runtime -i -1 "artifacts/build/server/index.js"
  ```

  This will start the process manager, with one app instance for each CPU core, except one.
