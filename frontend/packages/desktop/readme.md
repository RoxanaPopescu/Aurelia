# Package: `frontend-desktop`

### This represents the frontend, packaged as a desktop app

---

# Getting started

> Note that the steps for the repository must be completed first.

## Build and debug

1. **Build the `frontend` package for each locale, with the `desktop` platform as target**

   See the readme in that package for instructions.

   > Note that you cannot use the `develop` task here, as that does not write the artifacts to storage.

2. **Build this package**

   > Note that this automatically removes any existing `build` artifacts.

   In a terminal in this package folder, execute the command:

     ```
     npm run build
     ```

   > Note that you must manually rebuild after making any changes.

2. **Start debugging in `Visual Studio Code`, using the `Debug desktop app` configuration**

   > Note that you must manually restart after each build.

3. **The app should now be running**

   Use the development tools in the app window, which is essentially a `Chromium` browser, to test and debug the app.

   >  Note that on `macOS`, the shortcut to open the development tools is `Command + Option + I`.

   >  Note that on `Windows`, the shortcut to open the development tools is `F12`.

## Additional tasks

* **Lint the project**

  In a terminal in this package folder, execute the command:

  ```
  npm run lint
  ```

  This will log any lint errors or warnings to the terminal.

* **Build a release**

  First, build the `frontend` package for each locale, with the `desktop` platform and `production` environment as target.

  Then, in a terminal in this package folder, execute the command:

  ```
  npm run release
  ```

  This will produce a `release` artifact.
