import { Order } from "./Order";
import { OrderItem } from "./OrderItem";

describe('Order unit tests', () => {
  it('should throw error when id is empty', () => {
    expect(() => {
      new Order('', 'customer-id', []);
    }).toThrowError('Id is required');
  });

  it('should throw error when customerId is empty', () => {
    expect(() => {
      new Order('orderId', '', []);
    }).toThrowError('Customer id is required');
  });

  it('should throw error when items is empty', () => {
    expect(() => {
      new Order('orderId', 'customerId', []);
    }).toThrowError('Item qtd must be greater than 0');
  });

  it('should calculate total', () => {
    const item = new OrderItem('itemId', 'item name', 100, 2, 'productId');
    const item2 = new OrderItem('itemId2', 'item name 2', 200, 2, 'productId2');
    const order = new Order('orderId', 'customerId', [item]);
    let total = order.total();

    expect(total).toBe(200);

    const order2 = new Order('orderId', 'customerId', [item, item2]);
    total = order2.total();

    expect(total).toBe(600);
  });

  it('should throw error if the item quantity is less or equal zero', () => {
    expect(() => {
      const item = new OrderItem('itemId', 'item name', 100, 0, 'productId');
      new Order('orderId', 'customerId', [item]);
    }).toThrowError('Item quantity must be greater than 0');
  });
});
