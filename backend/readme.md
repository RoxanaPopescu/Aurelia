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
  NODE_ENV="{environment}" && PORT={port} && BASE_URL="{base_url}" && node "artifacts/build/server/index.js"
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
  NODE_ENV="{environment}" && PORT={port} && BASE_URL="{base_url}" && pm2-runtime -i -1 "artifacts/build/server/index.js"
  ```

  This will start the process manager, with one app instance for each CPU core, except one.
