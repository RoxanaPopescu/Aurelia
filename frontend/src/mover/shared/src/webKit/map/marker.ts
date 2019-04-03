export class MoverMarker {
  public static markerIconWithLabel(color: string) {
    return {
      path:
        // tslint:disable-next-line:max-line-length
        "M8,20.7771429 C6.44571429,19.3371429 4.48,17.28 2.88,15.0171429 C1.25714286,12.7085714 0,10.1942857 0,8 C0,3.58857143 3.58857143,0 8,0 C12.4114286,0 16,3.58857143 16,8 C16,10.1942857 14.7428571,12.7085714 13.12,15.0171429 C11.52,17.28 9.55428571,19.3371429 8,20.7771429 L8,20.7771429 Z",
      strokeWeight: 0,
      fillColor: color,
      fillOpacity: 1,
      size: this.markerIconWithLabelSize,
      anchor: {
        y: this.markerIconWithLabelSize.height,
        x: this.markerIconWithLabelSize.width / 2
      },
      scale: 1
    };
  }

  public static markerIcon(color: string) {
    return {
      path:
        // tslint:disable-next-line:max-line-length
        "M8,20.7771429 C6.44571429,19.3371429 4.48,17.28 2.88,15.0171429 C1.25714286,12.7085714 0,10.1942857 0,8 C0,3.58857143 3.58857143,0 8,0 C12.4114286,0 16,3.58857143 16,8 C16,10.1942857 14.7428571,12.7085714 13.12,15.0171429 C11.52,17.28 9.55428571,19.3371429 8,20.7771429 L8,20.7771429 Z",
      strokeWeight: 0,
      fillColor: color,
      fillOpacity: 1,
      size: this.markerIconSize,
      scale: 1
    };
  }

  // tslint:disable-next-line:no-any
  public static get markerIconSize(): any {
    return {
      b: "px",
      f: "px",
      height: 23,
      width: 19
    };
  }

  // tslint:disable-next-line:no-any
  public static get markerIconWithLabelSize(): any {
    return {
      b: "px",
      f: "px",
      height: 21,
      width: 16
    };
  }
}
