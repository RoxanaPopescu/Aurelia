import React from "react";
import Base from "shared/src/services/base";

interface Props {}

export default class DeploymentComponent extends React.Component {
  constructor(props: Props) {
    super(props);
    document.title = Base.baseURL() + "DeploymentEnvironment";
  }

  render() {
    return <div>Hidden component for deployment test</div>;
  }
}
