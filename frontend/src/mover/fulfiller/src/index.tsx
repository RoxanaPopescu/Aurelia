// TODO: Remove this as soon as possible.
import "shared/src/webKit/LEGACY.scss";

import "shared/src/styles/base/index.scss";

import "shared/src/utillity/fixSelectionHandling";

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/navigation";

import { Profile } from "shared/src/model/profile";
import Localization from "shared/src/localization";

Localization.configure(
  document.documentElement!.getAttribute("formatlang")!,
  document.documentElement!.lang
);

Profile.autoLogin().then(() =>
  ReactDOM.render(<App />, document.getElementById("root") as HTMLElement)
);
