import EventHandlerInterface from "../../../@shared/events/event-handler.interface";
import { CustomerAddressChangedEvent } from "../customer-address-chenged.event";

export class SendMessageWhenAddressChangeHandler
  implements EventHandlerInterface<CustomerAddressChangedEvent>
{
  handle(event: CustomerAddressChangedEvent): void {
    const customer = event.eventData;       
    const address = customer.Address;        

    console.log(
      `Endereço do cliente: ${customer.id}, ${customer.name} 
       alterado para: ${address.street}, 
       ${address.number}, 
       ${address.zip}, 
       ${address.city}`,
    );
  }
}
