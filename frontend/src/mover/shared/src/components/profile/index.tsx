import React from "react";
import "./styles.scss";
import { Profile } from "shared/src/model/profile";
import { Button, ButtonType } from "shared/src/webKit";
import Localization from "shared/src/localization";
import { Session } from "shared/src/model/session";

export default class ProfilePage extends React.Component {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue("Profile_Title");
  }

  renderTopPart() {
    return (
      <div className="c-profilePage-cover">
        <img
          className="c-profilePage-cover-image"
          src={require("./assets/hero.jpg")}
        />
        <div className="c-profilePage-avatarContainer">
          <div className="c-profilePage-avatar">
            <div className="c-profilePage-avatarInitials">
              {Session.userInfo.initials}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderInformation() {
    return (
      <div className="c-profilePage-information">
        <div className="c-profilePage-headline font-heading">
          {Localization.operationsValue("Profile_GeneralInformation_Headline")}
        </div>
        <div className="c-profilePage-values">
          <div className="c-profilePage-valueWrapper">
            <div className="headline">
              {Localization.operationsValue("Profile_GeneralInformation_Name")}
            </div>
            <div>{Session.userInfo.fullName}</div>
          </div>
          <div className="c-profilePage-valueWrapper">
            <div className="headline">
              {Localization.operationsValue(
                "Profile_GeneralInformation_Username"
              )}
            </div>
            <div>{Session.userInfo.username}</div>
          </div>
        </div>
        <div className="c-profilePage-headline font-heading">
          {Localization.operationsValue("Profile_ContactInformation_Headline")}
        </div>
        <div className="c-profilePage-values">
          <div className="c-profilePage-valueWrapper">
            <div className="headline">
              {Localization.operationsValue("Profile_ContactInformation_Email")}
            </div>
            <div>{Session.userInfo.email}</div>
          </div>
        </div>
        <Button onClick={() => Profile.logout()} type={ButtonType.Action}>
          {Localization.operationsValue("DriverTracking_LogoutButton")}
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className="c-profilePage">
        {this.renderTopPart()}
        {this.renderInformation()}
      </div>
    );
  }
}
