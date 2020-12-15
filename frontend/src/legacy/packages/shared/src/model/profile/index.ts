import { observable } from "mobx";
import { Session } from "../session";
import { getUserClaims } from "legacy/helpers/identity-helper";

const enum Path {
  AccessToken = "access-token",
  RefreshToken = "refresh-token",
  Locale = "locale"
}

export interface Tokens {
  access: string;
  refresh: string;
}

// tslint:disable-next-line:class-name
export class _Profile {
  @observable claims = new Set<string>();
  @observable tokens?: Tokens;
  @observable isAuthenticated = false;

  constructor() {
    const accessToken = sessionStorage.getItem(Path.AccessToken) || localStorage.getItem(Path.AccessToken);
    const refreshToken = sessionStorage.getItem(Path.AccessToken) || localStorage.getItem(Path.RefreshToken);

    if (accessToken && refreshToken) {
      try
      {
        const tokens = { access: accessToken, refresh: refreshToken };
        this.claims = new Set(getUserClaims(tokens));
        this.tokens = tokens;
      }
      catch (error)
      {
        console.log(error);
      }
    }
  }

  public async login(accessToken: string, refreshToken: string): Promise<void> {
    this.reset();
    this.setTokens(accessToken, refreshToken);

    if (await Session.start()) {
      this.isAuthenticated = true;
    }
  }

  public setTokens(accessToken: string, refreshToken: string) {
    // localStorage.setItem(Path.RefreshToken, refreshToken);
    // localStorage.setItem(Path.AccessToken, accessToken);
    this.tokens = { access: accessToken, refresh: refreshToken };
    this.claims = new Set(getUserClaims(this.tokens));
  }

  public async autoLogin() {
    if (this.tokens != null) {
      if (await Session.start()) {
        this.isAuthenticated = true;
      }
    }
  }

  public reset() {
    this.isAuthenticated = false;
    this.tokens = undefined;

    // localStorage.removeItem(Path.AccessToken);
    // localStorage.removeItem(Path.RefreshToken);
    this.claims = new Set();
  }

  public logout() {
    this.reset();
  }
}

export const Profile = new _Profile();
