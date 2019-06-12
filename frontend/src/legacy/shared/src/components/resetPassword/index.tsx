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
import { ButtonSize } from "../../webKit/button";
import H from "history";
import qs from "query-string";
import { ResetPasswordService } from "./service";
import { Profile } from "shared/src/model/profile";
import { OutfitType } from "../../model/logistics/outfit";
import { SubPage } from "../../utillity/page";
import { observable } from "mobx";

interface Props {
  type: OutfitType;
  location?: H.Location;
  history?: H.History;
}

@observer
export default class ForgotPassword extends React.Component<Props> {
  @observable loading: boolean = false;
  @observable validate: boolean = false;
  @observable username?: string;
  @observable token?: string;
  @observable password?: string;
  @observable passwordConfirmation?: string;
  @observable error?: string;

  service = new ResetPasswordService();

  constructor(props: Props) {
    super(props);
    document.title = "Reset kodeord";

    this.getUserInformation();
  }

  getUserInformation() {
    let queries = qs.parse(this.props.location!.search);
    if (queries.username) {
      this.username = queries.username;
    }
    if (queries.token) {
      this.token = queries.token;
    }
  }

  redirect() {
    this.props.history!.push(SubPage.path(SubPage.OrderList));
  }

  activateAccount() {
    this.error = undefined;

    if (
      this.passwordConfirmation === undefined ||
      this.password === undefined ||
      this.password !== this.passwordConfirmation
    ) {
      this.validate = true;
      return;
    }

    if (this.token === undefined || this.username === undefined) {
      this.error = Localization.sharedValue("Activation_MissingInformation");
      return;
    }

    this.loading = true;

    this.service.resetAndLogin(
      this.props.type,
      this.password,
      this.username,
      this.token
    )
      .then(async success => {
        if (success !== false) {
          this.redirect();

          const loginPromise = await Profile.login(
            success.accessToken,
            success.refreshToken
          );

          this.validate = false;
          this.loading = false;
          return loginPromise;
        }

        this.validate = false;
        this.loading = false;
        return Promise.resolve();
      })
      .catch(error => {
        this.validate = false;
        this.loading = false;
        this.error = error.message;
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
            onChange={value => (this.password = value)}
            onEnter={() => this.activateAccount()}
            disabled={this.loading}
            error={
              this.validate &&
              (this.password === undefined ||
                this.password !== this.passwordConfirmation)
            }
          />
          <InputPassword
            size={"medium"}
            headline={Localization.sharedValue("Activation_ConfirmPassword")}
            onChange={value => (this.passwordConfirmation = value)}
            onEnter={() => this.activateAccount()}
            disabled={this.loading}
            error={
              this.validate &&
              (this.passwordConfirmation === undefined ||
                this.password !== this.passwordConfirmation)
            }
          />
          <Button
            size={ButtonSize.Medium}
            type={ButtonType.Action}
            loading={this.loading}
            onClick={() => this.activateAccount()}
          >
            Indsend
          </Button>
        </div>
        {this.error !== undefined && (
          <Toast
            remove={() => (this.error = undefined)}
            type={ToastType.Alert}
          >
            {this.error}
          </Toast>
        )}
      </div>
    );
  }
}
