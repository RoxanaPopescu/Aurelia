import {
  IDriverPositions,
  DriverPosition,
  DriverPositionWithDelay,
} from './types/driver-positions';
import { autoinject } from 'aurelia-framework';
import { IScroll } from 'shared/framework';
import { RouteService } from 'app/model/route';
import { Position } from 'app/model/shared';

/**
 * Represents the module.
 */
@autoinject
export class DetailsModule {
  /**
   * Creates a new instance of the class.
   * @param routeService The `RouteService` instance.
   */
  public constructor(routeService: RouteService) {
    this.routeService = routeService;
    this.fetchData();
  }

  protected readonly routeService: RouteService;

  /**
   * Will fetch the initial mocked data.
   */
  protected async fetchData() {
    const { driver, positions }: IDriverPositions =
      await this.routeService.getRoutePath();
    const markerPositions = this.getDriverPositionsPerMinutes(positions).map(
      this.getDriverPositionWithDelay
    );

    this.data = {
      positions: markerPositions,
      driver,
      points: this.getRoutePoints(positions),
    };
  }

  private getRoutePoints(positions: DriverPosition[]) {
    return positions.map((pos) => {
      return new Position(pos).toGeoJsonPoint();
    });
  }

  private getDriverPositionWithDelay(
    position: DriverPosition,
    index: number,
    arr: DriverPosition[]
  ): DriverPositionWithDelay {
    let delayFromPrevious = 0;
    if (index > 0) {
      delayFromPrevious =
        (new Date(position.timestamp).getTime() -
          new Date(arr[index - 1].timestamp).getTime()) /
        (60 * 1000); // difference in minutes
    }
    return {
      ...position,
      timestamp: {
        date: new Date(position.timestamp).toLocaleDateString(),
        time: new Date(position.timestamp).toLocaleTimeString(),
      },
      delayFromPrevious: {
        delayInMinutes: Math.round(delayFromPrevious - 10),
        markWarning: delayFromPrevious >= 10, // if it takes 10 minutes or more, mark as warning
      },
    };
  }

  private getDriverPositionsPerMinutes(positions: DriverPosition[]) {
    const isADifferentMinuteThanPrevious = (
      currentTimestamp: string,
      previousTimestamp: string
    ) => {
      const currentDate = new Date(currentTimestamp);
      const previousDate = new Date(previousTimestamp);
      return (
        currentDate.getHours() * 60 + currentDate.getMinutes() !==
        previousDate.getHours() * 60 + previousDate.getMinutes()
      );
    };

    const driverPositionsPerMinutes = positions.reduce(
      (acc: DriverPosition[], currentPosition, currentIndex, arr) => {
        if (currentIndex === 0 || currentIndex === arr.length - 1) {
          acc.push(currentPosition); // we want to display the first and last positions, no matter what
        } else {
          if (
            isADifferentMinuteThanPrevious(
              currentPosition.timestamp,
              acc[acc.length - 1].timestamp
            )
          ) {
            acc.push(currentPosition);
          }
        }
        return acc;
      },
      []
    );
    return driverPositionsPerMinutes;
  }
  /**
   * The scroll manager for the page.
   */
  protected scroll: IScroll;

  /**
   * The data table element.
   */
  protected dataTableElement: HTMLElement;

  /**
   * The data to present.
   */
  protected data: any | undefined;
}
