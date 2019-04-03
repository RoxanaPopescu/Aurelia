import React from "react";
import DevTools from "mobx-react-devtools";
import { observer } from "mobx-react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Base } from "shared/src/webKit";
import { Profile } from "shared/src/model/profile";
import Login from "shared/src/components/login";
import Main from "./main";
import Localization from "shared/src/localization";
import DeploymentComponent from "shared/src/components/deployment";
import Activation from "../../../../shared/src/components/activation/index";
import H from "history";

interface Props {
  location?: H.Location;
}

@observer
export default class App extends React.Component<Props> {
  render() {
    return (
      <BrowserRouter>
        <div className="mainApplication">
          {Profile.isAuthenticated && location.pathname !== "/activation" ? (
            <Main />
          ) : (
            <Switch>
              <Route
                path="/activation"
                render={props => <Activation type={"Fulfiller"} {...props} />}
              />
              <Route path="/">
                <Login
                  type="Fulfiller"
                  description={Localization.operationsValue(
                    "Login_Info_Description"
                  )}
                />
              </Route>
            </Switch>
          )}
          <Route
            exact={true}
            path="/__environment"
            component={DeploymentComponent}
          />
          {Base.isProduction === false && <DevTools />}
        </div>
      </BrowserRouter>
    );
  }
}
