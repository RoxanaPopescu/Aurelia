import React from "react";
import "./styles.scss";

import { RemoteSelect } from "shared/src/webKit";
import { OptionGroup, Option } from "shared/src/webKit/select/remoteSelect";
import Localization from "../../localization";
import { Location } from "shared/src/model/general/location";

import LocationService from "./service";
import { debounce } from "throttle-debounce";
import { Address } from "shared/src/model/general/address";

interface Props {
  error?: boolean;
  value?: Address | Location;
  headline?: string;
  placeholder: string;
  disabled?: boolean;
  locationRequired?: boolean;
  onChange?(value?: Location);
  onSearchChange?(query?: string);
}

interface State {
  results?: OptionGroup[];
  value?: Address | Location;
}

export default class AddressSearchComponent extends React.Component<
  Props,
  State
> {
  static defaultProps = {
    placeholder: Localization.sharedValue("Input_TypeToSearch")
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      results: undefined,
      value: props.value
    };

    this.onSearchChange = debounce(210, false, this.onSearchChange);
  }

  componentWillReceiveProps(props: Props) {
    this.setState({
      value: props.value
    });
  }

  onSearchChange(value: string | undefined) {
    this.searchChanged(value);
    if (this.props.onSearchChange) {
      this.props.onSearchChange(value);
    }
  }

  fetchPositionIfPossible(address: Address) {
    if (!address.id) {
      return;
    }

    LocationService.getLocation(address.id, address.provider)
      .then(location => {
        if (this.props.onChange) {
          this.props.onChange(location);
        }
      })
      .catch(() => {
        // Do nothing about it
      });
  }

  getValue() {
    if (this.state.value) {
      let address =
        this.state.value instanceof Address
          ? this.state.value
          : this.state.value.address;
      return {
        label: address.primary,
        value: {
          mainText: address.primary,
          secondaryText: address.secondary
        }
      };
    } else {
      return undefined;
    }
  }

  render() {
    return (
      <RemoteSelect
        error={this.props.error}
        headline={this.props.headline}
        iconUrl={require("./assets/marker.svg")}
        className="c-addressSearch"
        size={"medium"}
        disabled={this.props.disabled}
        optionGroups={this.state.results}
        placeholder={this.props.placeholder}
        defaultTexts={{
          noResult: Localization.sharedValue("Search_NoResults"),
          emptySearch: Localization.sharedValue("Search_TypeToSearch")
        }}
        onSearchChange={query => this.onSearchChange(query)}
        onChange={option => {
          if (option) {
            let address = option!.data! as Address;
            if (this.props.onChange) {
              if (!this.props.locationRequired) {
                this.props.onChange(new Location({ address: address }));
              } else {
                this.fetchPositionIfPossible(address);
              }
            }
          } else {
            if (this.props.onChange) {
              this.props.onChange();
            }
          }
        }}
        value={this.getValue()}
      />
    );
  }

  private searchChanged(value: string | undefined) {
    if (value === undefined) {
      this.setState({ results: undefined });
      return;
    }

    LocationService.addresses(value)
      .then(addresses => {
        if (this.props.locationRequired) {
          addresses = addresses.filter(a => a.id !== undefined);
        }

        if (addresses.length <= 0) {
          this.setState({ results: undefined });
          return;
        }

        let options: Option[] = addresses.map(address => {
          let option: Option = {
            mainText: address.primary,
            secondaryText: address.secondary,
            data: address
          };
          return option;
        });

        let results: OptionGroup = {
          headline: Localization.sharedValue("Location_Headline_BestMatched"),
          options: options
        };

        this.setState({ results: [results] });
      })
      .catch(() => {
        // Do nothing about it
      });
  }
}
