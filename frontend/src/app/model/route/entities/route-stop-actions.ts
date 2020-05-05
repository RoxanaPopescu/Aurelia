/**
 * Represents the actions that are required to complete the stop.
 */
export class RouteStopActions
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data?: any)
    {
        if (data) {
            this.instructionsAccept = data.instructionsAccept;
            this.timeFrameVerification = data.timeFrameVerification;
            this.scanColli = data.scanColli;
            this.handleAllColli = data.handleAllColli;
            this.signature = data.signature;
            this.photo = data.photo;
            this.verificationCode = data.verificationCode;
            this.colliCountVerification = data.colliCountVerification;
        } else {
            this.instructionsAccept = false;
            this.timeFrameVerification = false;
            this.scanColli = false;
            this.handleAllColli = false;
            this.signature = false;
            this.photo = false;
            this.verificationCode = false;
            this.colliCountVerification = false;
        }
    }

    /**
     * True if the instructions must be accepted, otherwise false.
     */
    public instructionsAccept: boolean;

    /**
     * True if the time frame must be verified, otherwise false.
     */
    public timeFrameVerification: boolean;

    /**
     * True to enable colli scanning for the stop, otherwise false.
     */
    public scanColli: boolean;

    /**
     * True if all colli must be handled by either scanning or rejecting, otherwise false.
     */
    public handleAllColli: boolean;

    /**
     * True if a signature must be captured as proof of delivery, otherwise false.
     */
    public signature: boolean;

    /**
     * True if a photo must be captured as proof of delivery, otherwise false.
     */
    public photo: boolean;

    /**
     * True if a verificatio code must be entered as proof of delivery, otherwise false.
     */
    public verificationCode: boolean;

    /**
     * True if verification colli count is required. This is usually colli verification without barcodes.
     */
    public colliCountVerification: boolean;
}
