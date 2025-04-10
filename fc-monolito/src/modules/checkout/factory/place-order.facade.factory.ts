import PlaceOrderFacade from "../facade/place-order.facade";

export class PlaceOrderFacadeFactory {
  static create(): PlaceOrderFacade {
    const facade = new PlaceOrderFacade();
    return facade;
  }
} 