// tslint:disable-next-line:class-name
class _Base {
  theme: {
    logoNarrowURL: string;
    logoWideURL: string;
    logoHeight: string;
    logoLeft: string;
    name: string;
  };

  isProduction: boolean;

  constructor() {
    let mapping = require("../assets/mapping.json");

    let currentHostname: string;
    if (location.hostname.indexOf(".") !== -1) {
      currentHostname = location.hostname
        .split(".")
        .slice(-2)
        .join(".");
    } else {
      currentHostname = location.hostname;
    }

    let themedId;
    let isProduction = false;
    Object.keys(mapping.config).forEach(company => {
      let themedDomains = mapping.config[company].themedDomains;

      for (let themedDomain of themedDomains) {
        if (themedDomain === currentHostname) {
          themedId = company;
          break;
        }
      }

      let productionDomains = mapping.config[company].productionDomains;

      for (let productionDomain of productionDomains) {
        if (productionDomain === currentHostname) {
          isProduction = true;
          break;
        }
      }
    });

    let data;
    if (themedId) {
      data = mapping.content[themedId];
    } else {
      let key = "default";
      data = mapping.content[key];
    }

    this.isProduction = isProduction;
    this.theme = {
      logoNarrowURL: data.logo.narrow,
      logoWideURL: data.logo.wide,
      logoHeight: data.logo.height,
      logoLeft: data.logo.left,
      name: data.name
    };
  }
}

export const Base = new _Base();
