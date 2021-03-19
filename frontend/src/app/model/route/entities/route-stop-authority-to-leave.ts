/**
 * Represents the if the driver is allowed to leave the colli without the consumer being home.
 */
 export class RouteStopAuthorityToLeave
 {
     /**
      * Creates a new instance of the type.
      * @param data The response data from which the instance should be created.
      */
     public constructor(data?: any)
     {
         if (data)
         {
             this.deliveryInstructions = data.deliveryInstructions;
         }
     }

     /**
      * The delivery instructions from the consumer
      */
     public deliveryInstructions?: string;
 }
