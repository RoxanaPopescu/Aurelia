import { autoinject } from "aurelia-framework";
import { Position } from "app/model/shared";
import { DateTimeRange } from "shared/types";
import { DateTime, Duration } from "luxon";
import { observable } from "mobx";

/**
 * Represents a service that manages routes.
 */
@autoinject
export class RouteDriverPositionsService
{
    /**
     * Creates a new instance of the type.
     * @param positions The `Positions` instance.
     */
    public constructor(positions: Position[])
    {
        this.positions = positions;
        this.canPlay = positions.length > 0;

        const rangeDuration = this.timeRange.duration;
        const iterations = Math.round(this.playTime.milliseconds / this.timeoutDelay.milliseconds);
        this.increment = Duration.fromMillis(rangeDuration.milliseconds / iterations);
    }

    public readonly positions: Position[];
    public readonly canPlay: boolean;
    @observable public status: "playing" | "paused" | "idle" = "idle";
    @observable public currentPosition?: Position;
    private currentPositionIndex = 0;

    private readonly playTime = Duration.fromMillis(8 * 1000);
    private readonly timeoutDelay = Duration.fromMillis(100);

    private timer: any;
    private currentDate = DateTime.local();
    private currentDuration = Duration.fromMillis(0);
    private increment: Duration;

    private get timeRange(): DateTimeRange {
        const from = this.positions[0].timestamp!
        const to = this.positions[this.positions.length-1].timestamp!
        return new DateTimeRange({from: from, to: to}, { setZone: true });
    }

    /**
     * Finds the nearest position
     */
    private setNextPosition() {

        for (let i = this.currentPositionIndex; i < this.positions.length; i++) {
            const position = this.positions[i];
            // const nextPosition = (i+2) > this.positions.length ? undefined : this.positions[i+1];

            if (position.timestamp! >= this.currentDate) {
                this.currentPosition = position;
                this.currentPositionIndex = i;
                break;
            }
        }
    }

    private setTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(
            () => {
                this.currentDuration = this.currentDuration.plus(this.timeoutDelay)
                this.currentDate = this.currentDate.plus(this.increment);
                this.setNextPosition();

                if (this.currentDuration > this.playTime) {
                    this.status = "idle";
                } else {
                    this.setTimer();
                }
            },
            this.timeoutDelay.milliseconds
        );
    }

    public play() {
        if (!this.canPlay) {
            console.log("Not possible to play with no gps points");
            return;
        }

        this.status = "playing";
        this.currentDuration = Duration.fromMillis(0);
        this.currentPositionIndex = 0;
        this.currentDate = this.timeRange.from!;
        this.setNextPosition();
        this.resume();
    }

    public playOrResume() {
        if (this.status == "playing") {
            this.pause();
        } else if (this.status == "paused") {
            this.resume();
        } else {
            this.play();
        }
    }

    public pause() {
        this.status = "paused";
        clearTimeout(this.timer);
    }

    public resume() {
        this.status = "playing";
        this.setTimer();
    }

    public reset() {
        this.status = "idle";
        clearTimeout(this.timer);
    }
}
