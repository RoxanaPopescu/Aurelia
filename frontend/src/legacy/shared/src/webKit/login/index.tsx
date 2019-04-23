import "./styles.scss";
import React from "react";
import Input from "../input";
import InputPassword from "../input/password";
import { Button, ButtonType } from "../button";
import Validation from "../utillity/validation";

export interface LoginProps {
  logoUrl: string;
  defaultTexts: {
    headline: string;
    subtitle: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    buttonText: string;
    poweredBy?: string;
  };
  error?: string;
  loading: boolean;
  loginTrigger(email: string, password: string);
}

export interface LoginState {
  loading?: boolean;
  password?: string;
  email?: string;
  validate: boolean;
}

export default class LoginComponent extends React.Component<
  LoginProps,
  LoginState
> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      loading: props.loading,
      validate: false
    };
  }

  login() {
    if (
      !this.state.email ||
      !this.state.password ||
      Validation.email(this.state.email)
    ) {
      this.setState({ validate: true });
      return;
    }

    this.setState({ validate: false });
    this.props.loginTrigger(this.state.email, this.state.password);
  }

  componentWillReceiveProps(nextProps: LoginProps) {
    this.setState({
      loading: nextProps.loading
    });
  }

  render() {
    return (
      <div id="c-loginOuterContainer" className="c-loginOuterContainer">
        <img className="c-loginOuterContainer-logo" src={this.props.logoUrl} />
        <div className="c-loginOuterContainer-content">
          <div className="c-loginOuterContainer-title font-larger thin">
            {this.props.defaultTexts.headline}
          </div>
          <div className="c-loginOuterContainer-description font-base light">
            {this.props.defaultTexts.subtitle}
          </div>
          <div className="c-loginContainer">
            <Input
              className="email c-loginContainer-inputElement"
              type={"email"}
              value={this.state.email}
              onEnter={() => this.login()}
              onChange={value => this.setState({ email: value })}
              placeholder={this.props.defaultTexts.emailPlaceholder}
              disabled={this.state.loading}
              error={
                this.state.validate &&
                (this.state.email === undefined ||
                  !Validation.email(this.state.email))
              }
            />
            <InputPassword
              className="c-loginOuterContainer-inputPassword c-loginContainer-inputElement"
              onEnter={() => this.login()}
              value={this.state.password}
              onChange={value => this.setState({ password: value })}
              placeholder={this.props.defaultTexts.passwordPlaceholder}
              disabled={this.state.loading}
              error={this.state.validate && this.state.password === undefined}
            />
            <Button
              id="c-loginContainer-loginButton"
              className="c-loginContainer-loginButton"
              onClick={() => this.login()}
              type={ButtonType.Action}
              loading={this.props.loading}
            >
              {this.props.defaultTexts.buttonText}
            </Button>
          </div>
        </div>
        {this.props.defaultTexts.poweredBy && (
          <div className="c-loginOuterContainer-poweredBy">
            {this.props.defaultTexts.poweredBy}
          </div>
        )}
      </div>
    );
  }
}
