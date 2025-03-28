import { v4 as uuid } from 'uuid';
import { OtherProduct } from '../entity/OtherProduct';
import { Product } from '../entity/Product';
import { ProductTypeInterface } from '../entity/ProductInterface';

export class ProductFactory {
  static create(type: string, name: string, price: number): ProductTypeInterface {
    switch (type) {
      case 'a':
        return new Product(uuid(), name, price);
      case 'b':
        return new OtherProduct(uuid(), name, price);
      default:
        throw new Error('Invalid product type');
    }
  }
}
