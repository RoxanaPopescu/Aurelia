import "./styles.scss";
import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import {
  Input,
  InputPassword,
  Button,
  ButtonType,
  Toast,
  ToastType,
  Base
} from "shared/src/webKit";
import Validation from "../../utillity/validation";
import { LoginService } from "./service";
import { LoginStore } from "./store";
import { Profile } from "../../model/profile";
import { ButtonSize } from "../../webKit/button/index";
import { OutfitType } from "../../model/logistics/outfit";

interface Props {
  description: string;
  type: OutfitType;
}

const store = new LoginStore();

@observer
export default class Login extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("Login_Title");
  }

  login() {
    store.error = undefined;

    if (store.email === undefined || store.password === undefined) {
      store.validate = true;
      return;
    }

    store.loading = true;

    LoginService.login(this.props.type, store.email, store.password)
      .then(async success => {
        if (success !== false) {
          const loginPromise = await Profile.login(
            success.accessToken,
            success.refreshToken
          );

          store.validate = false;
          store.loading = false;
          return loginPromise;
        }

        store.validate = false;
        store.loading = false;
        return Promise.resolve();
      })
      .catch(error => {
        store.validate = false;
        store.loading = false;
        store.error = error.message;
      });
  }

  render() {
    return (
      <div className="c-login-outerContainer">
        <img
          className="c-login-background"
          src={require("./assets/background.jpg")}
        />
        <div className="c-login-backgroundOverlayLight" />
        <div className="c-login-backgroundOverlayDark" />
        <img className="c-login-logo" src={Base.theme.logoWideURL} />
        <div className="c-login-container">
          <div className="c-login-content dark">
            <div className="c-login-container-title font-larger">
              {Localization.operationsValue("Login_Info_Title")}
            </div>
            <div className="c-login-container-description">
              {this.props.description}
            </div>
            <Input
              className="email c-login-container-inputElement"
              type={"email"}
              height="44px"
              value={store.email}
              onEnter={() => this.login()}
              onChange={value => (store.email = value)}
              placeholder={Localization.consignorValue(
                "Connect_Login_EmailPlaceholder"
              )}
              disabled={store.loading}
              error={
                store.validate &&
                (store.email === undefined || !Validation.email(store.email))
              }
            />
            <InputPassword
              className="c-login-container-inputPassword c-login-container-inputElement"
              onEnter={() => this.login()}
              value={store.password}
              height="44px"
              onChange={value => (store.password = value)}
              placeholder={Localization.consignorValue(
                "Connect_Login_PasswordPlaceholder"
              )}
              disabled={store.loading}
              error={store.validate && store.password === undefined}
            />
            <Button
              className="c-loginContainer-loginButton"
              onClick={() => this.login()}
              type={ButtonType.Neutral}
              size={ButtonSize.Medium}
              loading={store.loading}
            >
              {Localization.consignorValue("Connect_Login_Button")}
            </Button>
          </div>
          <div className="c-login-poweredBy">
            {Localization.sharedValue("PoweredBy")}
          </div>
        </div>
        {store.error !== undefined && (
          <Toast
            remove={() => (store.error = undefined)}
            type={ToastType.Alert}
          >
            {store.error}
          </Toast>
        )}
      </div>
    );
  }
}
