import React from "react";
import "./styles.scss";
import { observer } from "mobx-react";
// import { InputCheckbox } from "shared/src/webKit";
// import { saveOrdersStore } from "../save";
// import { SaveOrderType } from "../save/store";

@observer
export default class OrderSettingsComponent extends React.Component {
  render() {
    return (
      <React.Fragment>
        {/*
          <div className="font-large c-orderSettings-headline">
            General order
          </div>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.PickupDateTime,
              true
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.PickupDateTime,
                true
              )
            }
          >
            Afhentningstid
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.DeliveryDateTime,
              true
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.DeliveryDateTime,
                true
              )
            }
          >
            Leveringstid
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.PickupAddress,
              true
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.PickupAddress,
                true
              )
            }
          >
            Afhentningsaddresse
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.DeliveryAddress,
              true
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.DeliveryAddress,
                true
              )
            }
          >
            Leveringsaddresse
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.Instructions,
              true
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.Instructions,
                true
              )
            }
          >
            Instruktioner
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.ContactPerson,
              true
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.ContactPerson,
                true
              )
            }
          >
            Kontakt person/nummer
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.CompanyName,
              true
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(SaveOrderType.CompanyName, true)
            }
          >
            Firmanavn
          </InputCheckbox>
          <div className="font-large c-orderSettings-headline">Each order</div>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.PickupDateTime,
              false
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.PickupDateTime,
                false
              )
            }
          >
            Afhentningstid
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.DeliveryDateTime,
              false
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.DeliveryDateTime,
                false
              )
            }
          >
            Leveringstid
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.PickupAddress,
              false
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.PickupAddress,
                false
              )
            }
          >
            Afhentningsaddresse
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.DeliveryAddress,
              false
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.DeliveryAddress,
                false
              )
            }
          >
            Leveringsaddresse
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.Instructions,
              false
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.Instructions,
                false
              )
            }
          >
            Instruktioner
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.ContactPerson,
              false
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.ContactPerson,
                false
              )
            }
          >
            Kontakt person/nummer
          </InputCheckbox>
          <InputCheckbox
            className="c-orderSettings-checkbox"
            checked={saveOrdersStore.existInTemplate(
              SaveOrderType.CompanyName,
              false
            )}
            onChange={() =>
              saveOrdersStore.addRemoveTemplate(
                SaveOrderType.CompanyName,
                false
              )
            }
          >
            Firmanavn
          </InputCheckbox>
        </> */}
      </React.Fragment>
    );
  }
}
