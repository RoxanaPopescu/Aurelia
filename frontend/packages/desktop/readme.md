# Package: `frontend-desktop`

### This represents the frontend, packaged as a desktop app

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

1. **Build the `frontend` package for each locale, with the `desktop` platform as target**

   See the readme in that package for instructions.

   > Note that you cannot use the `develop` task here, as that does not persist the artifacts.

2. **Build this package**

   > Note that this automatically removes any existing `build` artifacts.

   In a terminal in this package folder, execute the command:

     ```
     npm run build
     ```

   > Note that you must manually rebuild after making any changes.

3. **Start debugging in `Visual Studio Code`, using the `Debug desktop app` configuration**

   > Note that you must manually restart after each build.

4. **The app should now be running**

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

* **Package the build for distribution**

  > Note that you must first build the `frontend` package for each locale, with the `desktop` platform and `production` environment as target,
  > and then build this package to produce a build that can be packaged.

  In a terminal in this package folder, execute the command:

  ```
  npm run package
  ```

  This will remove any existing `package` artifacts, and then produce a new `package` artifact.
