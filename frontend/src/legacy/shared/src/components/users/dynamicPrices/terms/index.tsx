import React from "react";
import "./styles.scss";
import { DynamicPriceStore } from "../cleanup/dynamicPrices/dynamicPriceIndex";
import { observer } from "mobx-react";
import {
  InputRadioGroup,
  InputTextarea,
  Input,
  Select,
  InputNumbers
} from "shared/src/webKit";
import {
  DynamicPriceTerms,
  DynamicPriceTermsStops
} from "../cleanup/dynamicPrices/dynamicPriceTerms";

interface Props {
  store: DynamicPriceStore;
}

const store: DynamicPriceTerms = new DynamicPriceTerms();

@observer
export default class Templates extends React.Component<Props> {
  render() {
    return (
      <div className="c-singlePriceTerms">
        <div className="c-singlePriceTerms-termContainer">
          <div className="c-singlePriceTerms-title font-large primary light">
            Overstående prisstruktur er gældende:
          </div>
          <div className="c-singlePriceTerms-inputs">
            <InputRadioGroup
              radioButtons={[
                { value: "", headline: "Uanset antal stop" },
                { value: "", headline: "Hvis turen har" }
              ]}
              //checkedIndex={store.stops === DynamicPriceTermsStops.All ? 0 : 1}
              onChange={index => {
                store.stops =
                  index === 0
                    ? DynamicPriceTermsStops.All
                    : DynamicPriceTermsStops.Custom;
              }}
            />
            <Select
              className="dateSelect"
              options={[
                { label: "mere end", value: "a" },
                { label: "lig med", value: "b" },
                { label: "mindre end", value: "c" }
              ]}
              disabled={store.stops === DynamicPriceTermsStops.All}
              placeholder={"Vælg frekvens"}
              onSelect={() => {
                // FIXME:
              }}
            />
            <InputNumbers
              disabled={store.stops === DynamicPriceTermsStops.All}
              className="numbers"
              placeholder="Tilføj antal stop"
              valueDescription="stop."
              onChange={() => {
                // FIXME: Later
              }}
            />
          </div>
        </div>
        <div className="c-singlePriceTerms-subHeadline font-larger">
          Yderligere information
        </div>
        <div className="c-singlePriceTerms-additionalInfo">
          <Input
            className="c-singlePriceTerms-inputName"
            placeholder="Navngiv prisstrukturen"
            onChange={() => {
              // FIXME: Later
            }}
          />
          <InputTextarea
            className="c-singlePriceTerms-note"
            placeholder={"Tilføj note til prisstruktur om nødvendigt"}
            maxlength={256}
            minHeight={120}
            onChange={() => {
              // FIXME:
            }}
          />
        </div>
      </div>
    );
  }
}
