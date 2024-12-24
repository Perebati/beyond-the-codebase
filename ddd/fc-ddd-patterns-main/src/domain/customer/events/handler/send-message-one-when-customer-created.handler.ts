import EventHandlerInterface from "../../../@shared/events/event-handler.interface";
import { CustomerCreatedEvent } from "../customer-created.event";


export default class SendMessageOneWhenCustomerCreatedHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log('Esse é o primeiro console.log do evento: CustomerCreated');
  }
}
