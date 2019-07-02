import React from "react";
import {
  TableComponent,
  ButtonSize,
  ButtonType,
  ButtonAdd
} from "shared/src/webKit";
import Localization from "shared/src/localization";
import { AgreementsListStore } from "./store";
import { Outfit } from "shared/src/model/logistics/outfit";
import { AgreementsService } from "../../../services/agreementsService";
import { observer } from "mobx-react";
import { Row } from "shared/src/webKit/table";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";
import { observable } from "mobx";
import { Dialog } from "../../dialog/dialog";
import { InviteFulfiller } from "../invite/fulfiller";

export const store = new AgreementsListStore();

@observer
export default class AgreementsListComponent extends React.Component {
  @observable invitingFulfiller = false;

  // tslint:disable-next-line:no-any
  constructor(props: any) {
    super(props);
    document.title = Localization.operationsValue("Agremeents_List_Title");
  }

  componentDidMount() {
    this.fetch();
  }

  getHeaders(): { content: string; key: string }[] {
    return [
      {
        content: Localization.consignorValue("Departments_List_CompanyName"),
        key: "1"
      },
      {
        content: Localization.consignorValue("Departments_List_Type"),
        key: "2"
      }
    ];
  }

  fetch() {
    store.loading = true;
    store.error = undefined;

    AgreementsService.allAgreements()
      .then(agreements => {
        store.agreements = agreements;
        store.loading = false;
      })
      .catch(error => {
        store.error = error.message;
        store.loading = false;
      });
  }

  getRows(outfits: Outfit[]) {
    let rows: Row[][] = [];
    outfits.map(outfit => {
      rows.push([outfit.companyName, outfit.typeName]);
    });

    return rows;
  }

  render() {
    return (
      <React.Fragment>
        <PageHeaderComponent path={[{ title: "Aftaler" }]}>
          <ButtonAdd
            size={ButtonSize.Medium}
            type={ButtonType.Light}
            onClick={() => (this.invitingFulfiller = true)}
          >
            Inviter fulfiller/transportør
          </ButtonAdd>
        </PageHeaderComponent>

        <PageContentComponent>
          <TableComponent
            data={{
              headers: this.getHeaders(),
              rows: this.getRows(store.agreements)
            }}
            loading={store.loading}
            canSelectRow={() => false}
          />
        </PageContentComponent>

        {this.invitingFulfiller && (
          <Dialog
            title={"Inviter og opret fulfiller"}
            onClose={() => {
              this.invitingFulfiller = false;
            }}
          >
            <InviteFulfiller
              added={() => {
                this.invitingFulfiller = false;
                this.fetch();
              }}
            />
          </Dialog>
        )}
      </React.Fragment>
    );
  }
}
