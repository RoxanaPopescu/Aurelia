import React from "react";
import {
  TableComponent,
  ToastType,
  Toast,
  ButtonSize,
  ButtonType
} from "shared/src/webKit";
import Localization from "shared/src/localization";
import { DriverListStore } from "./store";
import { observer } from "mobx-react";
import { DriverInfo } from "shared/src/components/routes/details/routeDispatchService";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import H from "history";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";
import ButtonAdd from "shared/src/webKit/button/add";

interface Props {
  history?: H.History;
}

export const store = new DriverListStore();

@observer
export default class DriverListComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    document.title = Localization.operationsValue("Drivers_Title");
  }

  componentDidMount() {
    store.fetch();
  }

  getRows(results: DriverInfo[]) {
    let rows: string[][] = [];
    results.map(result => {
      rows.push([
        result.driver.id.toString(),
        result.driver.name.toString(),
        result.vehicleTypes.map(type => type.name).join(", "),
        result.driver.phone.toString()
      ]);
    });

    return rows;
  }

  getHeaders() {
    return [
      {
        content: Localization.sharedValue("Header_Id"),
        key: "0"
      },
      {
        content: Localization.sharedValue("Header_Name"),
        key: "1"
      },
      {
        content: Localization.sharedValue("Header_Vehicles"),
        key: "2"
      },
      {
        content: Localization.sharedValue("Header_Phone"),
        key: "3"
      }
    ];
  }

  render() {
    return (
      <>
        <PageHeaderComponent path={[{ title: "Chauffører" }]}>
          <ButtonAdd
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() =>
              this.props.history!.push(
                FulfillerSubPage.path(FulfillerSubPage.DriverCreate)
              )
            }
          >
            Tilføj chauffør
          </ButtonAdd>
        </PageHeaderComponent>

        <PageContentComponent>
          <TableComponent
            gridTemplateColumns="25% 25% 25% 25%"
            data={{
              headers: this.getHeaders(),
              rows: this.getRows(store.driverInfo)
            }}
            loading={store.loading}
            generateURL={index => {
              return FulfillerSubPage.path(FulfillerSubPage.DriverEdit).replace(
                ":id",
                store.driverInfo[index].driver.id.toString()
              );
            }}
          />
        </PageContentComponent>

        {store.error && (
          <Toast
            type={ToastType.Alert}
            remove={() => (store.error = undefined)}
          >
            {store.error}
          </Toast>
        )}
      </>
    );
  }
}
