# Package: `frontend-cloud`

### This represents the frontend, packaged as a cloud service

---

# Getting started

> Note that the instructions in the `readme.md` for the `frontend` package must be completed first.

## Install dependencies

1. **Install NPM dependencies**

   In a terminal in this folder, execute the command:

   ```
   npm ci
   ```

   This will install the dependencies listed in the `package-lock.json` file.

   > If you encounter errors related to `node-gyp`, [this may help](https://github.com/nodejs/node-gyp/issues/629).

## Build and debug

1. **Build the `frontend` package for each locale, with the `cloud` platform as target**

   See the readme in that package for instructions.

   > Note that you cannot use the `develop` task here, as that does not persist the artifacts.

2. **Build this package**

   > Note that this automatically removes any existing `build` artifacts.

   In a terminal in this package folder, execute the command:

     ```
     npm run build
     ```

   > Note that you must manually rebuild after making any changes.

3. **Start debugging in `Visual Studio Code`, using the `Debug cloud app` configuration**

   > Note that the app is automatically restarted after each build.

   > Note that source maps are protected in all environments except `development`.
   >
   > To enable debugging with protected source maps, set a cookie named `debug-token`,
   > with the secret token value `not-to-be-shared`.
   >
   > To enable serving of source maps to e.g. an error logging service, this token can also
   > be provided in an HTTP header named `x-debug-token` in the source map requests.

4. **The app should now be available on http://localhost:8080**

   Use `Google Chrome` to test and debug the frontend, and `Visual Studio Code` to debug the server.

## Additional tasks

* **Lint the project**

  In a terminal in this package folder, execute the command:

  ```
  npm run lint
  ```

  This will log any lint errors or warnings to the terminal.

* **Build for production**

  > Note that before building this package, you must first build the `frontend` package for each locale, with the `cloud` platform and `production` environment as target, to produce a build to be served.

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
  NODE_ENV="{environment}" PORT="{port}" BASE_URL="{base_url}" node "artifacts/build/server/index.js"
  ```

  Where:

  * `{environment}` should be replaced with either `development`, `preview` or `production`.<br>
    The default is `development`.

  * `{port}` should be replaced with the port on which the server should listen.<br>
    The default is `8080`.

  * `{base_url}` should be replaced with the host-relative path on which the app should be hosted.<br>
    The default is `/`.

  This will start the server using the specified settings.

  Note that for production use, it is recommended to use a process manager, such as [PM2](https://pm2.keymetrics.io/).

  To install this globally, execute the command:

  ```
  npm install pm2 -g
  ```

  To start an app cluster, execute the command:

  ```
  NODE_ENV="{environment}" PORT="{port}" BASE_URL="{base_url}" pm2-runtime -i -1 "artifacts/build/server/index.js"
  ```

  This will start the process manager, with one app instance for each CPU core, except one.
