import { Appointment } from './appointment';
import { Location } from "app/model/shared";

export class OrderStop
{
    /**
     * Creates a new instance of the type.
     * @param data The response data from which the instance should be created.
     */
    public constructor(data: any)
    {
        this.location = new Location(data.location);
        this.contactName = data.name;
        this.contactCompanyName = data.companyName;
        this.contactPhoneNumber = data.phone;
        this.contactEmail = data.email;
        this.appointment = new Appointment(data.appointment);
        this.instructions = data.instructions;
    }

    public location: Location;

    public contactName: string;

    public contactCompanyName: string;

    public contactPhoneNumber: string;

    public contactEmail: string;

    public appointment: Appointment;

    public instructions: string;

    /**
     * Gets the data representing this instance.
     */
    public toJSON(): any
    {
        return {
            location: this.location,
            name: this.contactName,
            companyName: this.contactCompanyName,
            phone: this.contactPhoneNumber,
            email: this.contactEmail,
            appointment: this.appointment.toJSON(),
            instructions: this.instructions
        };
    }
}
