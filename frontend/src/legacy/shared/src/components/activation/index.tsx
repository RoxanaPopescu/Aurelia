import "./styles.scss";
import React from "react";
import { observer } from "mobx-react";
import Localization from "shared/src/localization";
import {
  Toast,
  ToastType,
  InputPassword,
  Button,
  ButtonType
} from "shared/src/webKit";
import { ActivationStore } from "./store";
import { ButtonSize } from "../../webKit/button";
import H from "history";
import qs from "query-string";
import { ActivationService } from "./service";
import { Profile } from "shared/src/model/profile";
import { OutfitType } from "../../model/logistics/outfit";
import { SubPage } from "../../utillity/page";

interface Props {
  type: OutfitType;
  location?: H.Location;
  history?: H.History;
}

const store = new ActivationStore();

@observer
export default class Activation extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.sharedValue("Activation_Title");

    this.getUserInformation();
  }

  getUserInformation() {
    let queries = qs.parse(this.props.location!.search);
    if (queries.username) {
      store.username = queries.username;
    }
    if (queries.activationCode) {
      store.activationCode = queries.activationCode;
    }
  }

  redirect() {
    this.props.history!.push(SubPage.path(SubPage.OrderList));
  }

  activateAccount() {
    store.error = undefined;

    if (
      store.passwordConfirmation === undefined ||
      store.password === undefined ||
      store.password !== store.passwordConfirmation
    ) {
      store.validate = true;
      return;
    }

    if (store.activationCode === undefined || store.username === undefined) {
      store.error = Localization.sharedValue("Activation_MissingInformation");
      return;
    }

    store.loading = true;

    ActivationService.activateAndLogin(
      this.props.type,
      store.password,
      store.username,
      store.activationCode
    )
      .then(async success => {
        if (success !== false) {
          this.redirect();

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
      <div className="c-activation-outerContainer">
        <div className="c-activation-content">
          <div className="font-larger c-activation-headline">
            {Localization.sharedValue("Activation_Headline")}
          </div>
          <InputPassword
            size={"medium"}
            headline={Localization.sharedValue("Activation_Password")}
            onChange={value => (store.password = value)}
            onEnter={() => this.activateAccount()}
            disabled={store.loading}
            error={
              store.validate &&
              (store.password === undefined ||
                store.password !== store.passwordConfirmation)
            }
          />
          <InputPassword
            size={"medium"}
            headline={Localization.sharedValue("Activation_ConfirmPassword")}
            onChange={value => (store.passwordConfirmation = value)}
            onEnter={() => this.activateAccount()}
            disabled={store.loading}
            error={
              store.validate &&
              (store.passwordConfirmation === undefined ||
                store.password !== store.passwordConfirmation)
            }
          />
          <Button
            size={ButtonSize.Medium}
            type={ButtonType.Action}
            loading={store.loading}
            onClick={() => this.activateAccount()}
          >
            {Localization.sharedValue("Activation_Button")}
          </Button>
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
