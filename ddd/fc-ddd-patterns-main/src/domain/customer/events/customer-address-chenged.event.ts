import EventInterface from "../../@shared/events/event.interface";
import Customer from "../entity/customer";

export class CustomerAddressChangedEvent implements EventInterface {
  dataTimeOccurred: Date;
  eventData: Customer;

  constructor(customer: Customer) {
    this.dataTimeOccurred = new Date();
    this.eventData = customer;
  }
}