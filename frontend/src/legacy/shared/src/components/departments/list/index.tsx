import React from "react";
import {
  TableComponent,
  ToastType,
  Toast,
  ButtonSize,
  ButtonType
} from "shared/src/webKit";
import H from "history";
import Localization from "shared/src/localization";
import { DepartmentsListStore } from "./store";
import { Outfit } from "shared/src/model/logistics/outfit";
import DepartmentsService from "../service";
import { observer } from "mobx-react";
import { SubPage } from "shared/src/utillity/page";
import { Row } from "shared/src/webKit/table";
import { PageHeaderComponent } from "../../pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";
import ButtonAdd from "shared/src/webKit/button/add";

export const deparmentListStore = new DepartmentsListStore();

interface Props {
  history?: H.History;
}

@observer
export default class DepartmentsListComponent extends React.Component<Props> {
  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.consignorValue("Departments_List_Title");
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    deparmentListStore.loading = true;
    deparmentListStore.error = undefined;

    DepartmentsService.list()
      .then(outfits => {
        deparmentListStore.outfits = outfits;
        deparmentListStore.loading = false;
      })
      .catch(error => {
        deparmentListStore.error = error.message;
        deparmentListStore.loading = false;
      });
  }

  getRows(outfits: Outfit[]) {
    let rows: Row[][] = [];
    outfits.map(outfit => {
      rows.push([outfit.publicId, outfit.companyName]);
    });

    return rows;
  }

  render() {
    return (
      <>

        <PageHeaderComponent
          path={[
            { title: "Afdelinger" }
          ]}
        >

          <ButtonAdd
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() => this.props.history!.push(SubPage.path(SubPage.DepartmentsCreate))}
          >
            Tilføj afdeling
          </ButtonAdd>

        </PageHeaderComponent>

        <PageContentComponent>
        
          <TableComponent
            gridTemplateColumns="auto auto"
            generateURL={index => {
              return SubPage.path(SubPage.Department).replace(
                ":id",
                deparmentListStore.outfits![index].publicId
              );
            }}
            data={{
              headers: deparmentListStore.headers,
              rows: this.getRows(deparmentListStore.outfits)
            }}
            loading={deparmentListStore.loading}
            canSelectRow={() => false}
          />

        </PageContentComponent>

        {deparmentListStore.error && (
          <Toast
            type={ToastType.Alert}
            remove={() => (deparmentListStore.error = undefined)}
          >
            {deparmentListStore.error}
          </Toast>
        )}
        
      </>
    );
  }
}
