import Localization from "shared/src/localization";
import Base from "../../services/base";
import { DateTime, Duration } from "luxon";
import { KpiTemplate, Kpi, KpiGroup } from "./models";
import { KpiFormat } from "./models/kpiFormat";
import { OrganizationConnection } from "app/model/organization";

export class KpiService {
  static async fulfiller(
    toDate: DateTime,
    format: KpiFormat,
    consignorId?: string,
    connetion?: OrganizationConnection
  ): Promise<KpiTemplate> {
    try {
      var items = {
        consignorId: consignorId,
        toDate: toDate,
        format: format.value,
        fulfillerId: connetion?.organization.id
      };

      let response = await fetch(
        Base.url("kpi/routes", {}),
        Base.defaultConfig(items)
      );

      if (response.ok) {
        let responseJson = await response.json();

        return new KpiTemplate(
          responseJson.days.map(d => {
            return this.getFulfillerKpiTemplate(d, consignorId ? true : false);
          }),
          this.getFulfillerKpiTemplate(
            responseJson.last7Days,
            consignorId ? true : false
          ),
          this.getFulfillerKpiTemplate(
            responseJson.last30Days,
            consignorId ? true : false
          )
        );
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    } catch (error) {
      throw error;
    }
  }

  static async consignor(
    consignorId: string,
    toDate: DateTime,
    format: KpiFormat
  ): Promise<KpiTemplate> {
    try {
      var items = {
        consignorId: consignorId,
        toDate: toDate,
        format: format.value
      };

      let response = await fetch(
        Base.url("kpi/consignor", {}),
        Base.defaultConfig(items)
      );

      if (response.ok) {
        let responseJson = await response.json();

        return new KpiTemplate(
          responseJson.days.map(d => {
            return this.getFulfillerKpiTemplate(d, true);
          }),
          this.getFulfillerKpiTemplate(responseJson.last7Days, true),
          this.getFulfillerKpiTemplate(responseJson.last30Days, true)
        );
      } else {
        throw new Error(Localization.sharedValue("Error_General"));
      }
    } catch (error) {
      throw error;
    }
  }

  // tslint:disable-next-line:no-any
  static getFulfillerKpiTemplate(json: any, consignor?: boolean) {
    var overallGroup = [
      new Kpi(
        Localization.sharedValue("Kpi_Single:Deliveries"),
        json.deliveries
      )
    ];

    if (!!!consignor) {
      overallGroup.unshift(
        new Kpi(Localization.sharedValue("Kpi_Single:Routes"), json.routes)
      );
    }

    var template = [
      new KpiGroup("", overallGroup),

      new KpiGroup(
        Localization.sharedValue("Kpi_GroupHeadline:DelaysInDeliveries"),
        [
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedDeliveries"),
            json.delayedDeliveries
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedDeliveries10"),
            json.delayedDeliveries10
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedDeliveries30"),
            json.delayedDeliveries30
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedDeliveries60"),
            json.delayedDeliveries60
          )
        ]
      ),

      new KpiGroup(
        Localization.sharedValue("Kpi_GroupHeadline:PrematureDeliveries"),
        [
          new Kpi(
            Localization.sharedValue("Kpi_Single:TooEarlyDeliveries"),
            json.tooEarlyDeliveries
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:TooEarlyDeliveries10"),
            json.tooEarlyDeliveries10
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:TooEarlyDeliveries30"),
            json.tooEarlyDeliveries30
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:TooEarlyDeliveries60"),
            json.tooEarlyDeliveries60
          )
        ]
      ),

      new KpiGroup(
        Localization.sharedValue("Kpi_GroupHeadline:DelaysInPickups"),
        [
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedPickups"),
            json.delayedPickups
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedPickups10"),
            json.delayedPickups10
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedPickups30"),
            json.delayedPickups30
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:DelayedPickups60"),
            json.delayedPickups60
          )
        ]
      ),

      new KpiGroup(Localization.sharedValue("Kpi_GroupHeadline:LoadingTime"), [
        new Kpi(
          Localization.sharedValue("Kpi_Single:AverageLoadingTime"),
          Localization.formatDuration(
            Duration.fromMillis(json.averageLoadingTime),
            { format: "short" }
          )
        ),
        new Kpi(
          Localization.sharedValue("Kpi_Single:AveragePickupLoadingTime"),
          Localization.formatDuration(
            Duration.fromMillis(json.averagePickupLoadingtime),
            { format: "short" }
          )
        )
      ]),

      new KpiGroup(Localization.sharedValue("Kpi_GroupHeadline:Colli"), [
        new Kpi(
          Localization.sharedValue("Kpi_Single:EstimatedColli"),
          json.estimatedColli
        ),
        new Kpi(
          Localization.sharedValue("Kpi_Single:ActualColli"),
          json.actualColli
        )
      ]),

      new KpiGroup(Localization.sharedValue("Kpi_GroupHeadline:Estimations"), [
        new Kpi(
          Localization.sharedValue("Kpi_Single:ArrivalTimeEstimationAccuracy"),
          Localization.formatDuration(
            Duration.fromMillis(json.arrivalTimeEstimationAccuracy),
            { format: "short" }
          )
        ),
        new Kpi(
          Localization.sharedValue("Kpi_Single:LoadingTimeEstimationAccuracy"),
          Localization.formatDuration(
            Duration.fromMillis(json.loadingTimeEstimationAccuracy),
            { format: "short" }
          )
        )
      ])
    ];

    if (!!!consignor) {
      template.push(
        new KpiGroup(Localization.sharedValue("Kpi_GroupHeadline:Stops"), [
          new Kpi(
            Localization.sharedValue("Kpi_Single:EstimatedStops"),
            Localization.formatNumber(json.estimatedStops, 2)
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:EstimatedDeliveries"),
            Localization.formatNumber(json.estimatedDeliveries, 2)
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:ActualStops"),
            Localization.formatNumber(json.actualStops, 2)
          ),
          new Kpi(
            Localization.sharedValue("Kpi_Single:ActualDeliveries"),
            Localization.formatNumber(json.actualDeliveries, 2)
          )
        ])
      );
    }

    return template;
  }
}
