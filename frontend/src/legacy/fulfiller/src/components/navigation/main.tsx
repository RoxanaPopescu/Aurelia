import React from "react";
import { Switch, Redirect } from "react-router-dom";
import H from "history";
import { ModalContainer } from "react-router-modal";
import { SideMenu, GlobalTopMenu, Base } from "shared/src/webKit";
import Localization from "shared/src/localization";
import { FulfillerNavigationPage } from "./page";
import { NavigationPage, SubPage } from "shared/src/utillity/page";

import { Session } from "shared/src/model/session";
import { Profile } from "../../../../shared/src/model/profile/index";
import nJwt from "njwt";
import { observe, Lambda } from "mobx";

interface Props {
  history?: H.History;
}

interface State {
  // tslint:disable-next-line:no-any
  claims?: any;
}

export default class Main extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      claims: undefined
    };
  }

  private disposeProfileObserver: Lambda;

  componentDidMount() {
    this.getClaims();
    this.disposeProfileObserver = observe(Profile, "tokens", () =>
      this.getClaims()
    );
  }

  componentWillUnmount() {
    this.disposeProfileObserver();
  }

  getClaims() {
    // tslint:disable-next-line:no-any
    let claims: any;

    if (Profile.tokens) {
      // tslint:disable-next-line:no-any
      nJwt.verify(Profile.tokens.access, (error: any, verifiedJwt: any) => {
        if (error) {
          claims = error.parsedBody;
        } else {
          claims = verifiedJwt.parsedBody;
        }
        this.setState({ claims: claims });
      });
    } else {
      this.setState({ claims: undefined });
    }
  }

  renderClaimedMenuPages(): { text: string; url: string }[] {
    let pages: { text: string; url: string }[] = [];

    if (this.state.claims !== undefined) {
      if (this.state.claims["View KPIs"]) {
        pages.push(NavigationPage.page("Kpi"));
      }
      if (
        this.state.claims["Create order"] &&
        this.state.claims["Edit order"] &&
        this.state.claims["View orders"]
      ) {
        pages.push(NavigationPage.page("Orders"));
      }
      if (
        this.state.claims["Edit routes"] &&
        this.state.claims["View routes"]
      ) {
        pages.push(NavigationPage.page("Routes"));
      }
      if (
        this.state.claims["Edit routeplan"] &&
        this.state.claims["Edit routeplan settings"] &&
        this.state.claims["View routeplans"] &&
        this.state.claims["View routeplan settings"] &&
        this.state.claims["Create routeplan"] &&
        this.state.claims["Create routeplan settings"]
      ) {
        pages.push(FulfillerNavigationPage.page("RoutePlanning"));
      }
      if (
        this.state.claims["Create Depot"] &&
        this.state.claims["View Depot"] &&
        this.state.claims["Edit Depot"]
      ) {
        pages.push(FulfillerNavigationPage.page("Depots"));
      }
      if (
        this.state.claims["Invite driver"] &&
        this.state.claims["View drivers"] &&
        this.state.claims["Edit vehicle"] &&
        this.state.claims["Create vehicle"] &&
        this.state.claims["View vehicles"]
      ) {
        pages.push(FulfillerNavigationPage.page("FleetManagement"));
      }

      pages.push(FulfillerNavigationPage.page("Communication"));

      if (
        this.state.claims["Create departments"] &&
        this.state.claims["Edit departments"] &&
        this.state.claims["View departments"]
      ) {
        pages.push(NavigationPage.page("Departments"));
      }
      if (
        this.state.claims["Create user"] &&
        this.state.claims["Edit user"] &&
        this.state.claims["View users"]
      ) {
        pages.push(NavigationPage.page("Users"));
      }

      pages.push(NavigationPage.page("Agreements"));

      return pages;
    } else {
      return pages;
    }
  }

  render() {
    return (
      <React.Fragment>
        <GlobalTopMenu
          logoUrls={{
            wide: Base.theme.logoWideURL,
            narrow: Base.theme.logoNarrowURL
          }}
          rootPath=""
          menuItems={[]}
        />
        <SideMenu
          key="sideMenu"
          note={Localization.sharedValue("PoweredBy")}
          sections={[
            {
              pages: this.renderClaimedMenuPages()
            }
          ]}
          userInformation={{
            name: {
              first: Session.userInfo.firstName || Session.userInfo.username,
              last: Session.userInfo.lastName
            },
            url: NavigationPage.path("Profile"),
            outfitName: Session.outfit.primaryName
          }}
        >
          <Switch>
            {NavigationPage.routes("Orders")}
            {NavigationPage.routes("Routes")}
            {FulfillerNavigationPage.routes("RoutePlanning")}
            {FulfillerNavigationPage.routes("Depots")}
            {FulfillerNavigationPage.routes("FleetManagement")}
            {NavigationPage.routes("Users")}
            {NavigationPage.routes("Kpi")}
            {NavigationPage.routes("Departments")}
            {NavigationPage.routes("Agreements")}
            {FulfillerNavigationPage.routes("Communication")}
            {NavigationPage.routes("Profile")}
            <Redirect
              exact={true}
              from="/"
              to={SubPage.path(SubPage.OrderList)}
            />
          </Switch>
        </SideMenu>
        <ModalContainer />
      </React.Fragment>
    );
  }
}
