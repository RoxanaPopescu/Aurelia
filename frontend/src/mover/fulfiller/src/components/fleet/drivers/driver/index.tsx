import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import Localization from "shared/src/localization";
import { TabBarComponent, ErrorInline } from "shared/src/webKit";
import { DriverService } from "./services/driverService";
import { VehicleService } from "./services/vehicleService";
import { DriverProfile } from "./components/driverProfile/driverProfile";
import { DriverVehicles } from "./components/driverVehicles/driverVehicles";
import H from "history";
import "./index.scss";
import { FulfillerSubPage } from "fulfiller/src/components/navigation/page";
import { PageHeaderComponent } from "shared/src/components/pageHeader";
import { PageContentComponent } from "shared/src/components/pageContent";
import { observable } from "mobx";

export interface DriverComponentParams {
  history: H.History;
  id: string;
}

@observer
export default class DriverComponent extends React.Component<
  RouteComponentProps<DriverComponentParams>
> {
  private driverService: DriverService;
  private vehicleService: VehicleService;
  private tabBarComponent: TabBarComponent | null;
  private error: Error | undefined;

  @observable
  private tab = "profile";

  public constructor(props: RouteComponentProps<DriverComponentParams>) {
    super(props);

    const driverId =
      props.match.params.id != null
        ? parseInt(props.match.params.id, 10)
        : undefined;

    this.fetch(driverId);
  }

  public render() {
    
    if (this.error) {
      document.title = Localization.sharedValue("Error_General");
      return (
        <ErrorInline description={this.error.message}/>
      );
    }

    const title = this.driverService.driver != null 
      ? this.driverService.driver.id != null
        ? this.driverService.driver.name.toString()
        : Localization.operationsValue("Driver_CreateTitle")
      : Localization.operationsValue("Driver_LoadingTitle");

    document.title = `${title} | Chauffører`;

    return (
      <>

        <PageHeaderComponent
          history={this.props.history}
          path={[
            { title: "Chauffører", href: FulfillerSubPage.path(FulfillerSubPage.DriverList) },
            { title: title }
          ]}
          tabs={[
            { name: "profile", title: Localization.operationsValue("Driver_Tabs_Profile")},
            { name: "vehicles", title: Localization.operationsValue("Driver_Tabs_Vehicles")}
          ]}
          tab={this.tab}
          onTabChange={tab => {
            this.tab = tab;
          }}
        />

        <PageContentComponent>
        
          <div className="c-driver">
            
            {this.tab === "profile" &&
            <DriverProfile
              history={this.props.history}
              driverService={this.driverService}
              onDriverAdded={() => this.onDriverAdded()}
            />}

            {this.tab === "vehicles" &&
            <DriverVehicles
              driverService={this.driverService}
              vehicleService={this.vehicleService}
            />}

          </div>

        </PageContentComponent>

      </>
    );
  }

  private async fetch(driverId: number | undefined): Promise<void> {
    try {
      this.driverService = new DriverService(driverId);
      this.vehicleService = new VehicleService(driverId);
    } catch (error) {
      this.error = error;
    }
  }

  private onDriverAdded(): void {
    this.tabBarComponent!.setState({ selectedIndex: 1 });
  }
}
