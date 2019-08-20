import React from "react";
import { observer } from "mobx-react";
import {
  ButtonType,
  Button,
  TableComponent,
  ErrorInline,
  LoadingInline
} from "shared/src/webKit";
import H from "history";
import { ButtonSize } from "shared/src/webKit/button";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";
import { Depot } from "shared/src/model/logistics/depots";
import { FulfillerSubPage } from "../../navigation/page";
import { DepotsListStore } from "./store";
import Localization from "shared/src/localization";
import ButtonAdd from "shared/src/webKit/button/add";

interface Props {
  history?: H.History;
}

const store = new DepotsListStore();

@observer
export default class RoutePlanningDepotsListComponent extends React.Component<Props> {

  // tslint:disable-next-line:no-any
  public constructor(props: Props) {
    super(props);
    document.title = "Terminaler";
  }

  public componentDidMount() {
    store.fetch();
  }

  public getRows(depots: Depot[]) {
    return depots.map(depot =>
      [ depot.name, depot.location ? depot.location.address.formattedString() : ""]);
  }

  public render() {

    if (store.error) {
      return (
        <ErrorInline description={store.error}>
          <Button onClick={() => store.fetch()} type={ButtonType.Action}>
            {Localization.sharedValue("Retry")}
          </Button>
        </ErrorInline>
      );
    }

    if (!store.depots) {
      return <LoadingInline/>;
    }

    return (
      <React.Fragment>

        <PageHeaderComponent
          path={[
            { title: "Terminaler" }
          ]}
        >

          <ButtonAdd
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() => this.props.history!.push(FulfillerSubPage.path(FulfillerSubPage.DepotCreate))}
          >
            Tilføj terminal
          </ButtonAdd>

        </PageHeaderComponent>

        <PageContentComponent>

          <TableComponent
            loading={store.loading}
            generateURL={index => FulfillerSubPage.path(FulfillerSubPage.DepotDetails)
              .replace(":id", store.depots[index].id!.toString())}
            data={{
              headers: store.headers,
              rows: this.getRows(store.depots)
            }}
          />

        </PageContentComponent>

      </React.Fragment>
    );
  }
}
