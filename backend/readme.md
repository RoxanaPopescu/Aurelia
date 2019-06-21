# Package: `backend`

### This represents the backend for the Mover logistics platform

---

# Getting started

> Note that the steps for the repository must be completed first.

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

  This will produce a `build` artifact.

* **Start the production build**

  In a terminal in this package folder, execute the command:

  ```
  npm run start
  ```

  This will start the server on the port specified by the environment variable `PORT`, or default to `8008`.
