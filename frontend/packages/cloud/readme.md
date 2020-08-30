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

   Use `Google Chrome` to test and debug the client, and `Visual Studio Code` to debug the server.

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

  This will start the server on the port specified by the environment variable `PORT`, or default to `8080`.
