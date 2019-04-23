import React from "react";
import "./index.scss";
import Localization from "shared/src/localization";
import { observer } from "mobx-react";
import Filters from "./components/filters/filters";
import Table from "./components/table/table";
import Header from "./components/header/header";

@observer
export default class DriverDispatchComponent extends React.Component {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue("Drivers_Title");
  }

  render() {
    return (
      <div className="c-driverDispatch-container">
        <Filters />
        <div className="c-driverDispatch-main">
          <Header />
          <Table />
        </div>
      </div>
    );
  }
}
