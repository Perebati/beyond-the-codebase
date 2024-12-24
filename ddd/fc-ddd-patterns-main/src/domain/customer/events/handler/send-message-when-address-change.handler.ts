import EventHandlerInterface from "../../../@shared/events/event-handler.interface";
import { CustomerCreatedEvent } from "../customer-created.event";

export default class SendMessageWhenAddressChangeHandler
  implements EventHandlerInterface<CustomerCreatedEvent>
{
  handle(event: CustomerCreatedEvent): void {
    console.log(
      `Endereço do cliente: ${event.eventData._id}, ${event.eventData._name} 
       alterado para: ${event.eventData._street},
       ${event.eventData._number}, 
       ${event.eventData._zip}, 
       ${event.eventData._city},`,
    );
  }
}
