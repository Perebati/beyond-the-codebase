import { ValidatorInterface } from "../../@shared/validator/ValidatorInterface";
import { OtherProduct } from "../entity/OtherProduct";
import { Product } from "../entity/Product";
import { ProductYupValidator } from "../validator/ProductYupValidator";

export class ProductValidatorFactory {
  static create(): ValidatorInterface<Product | OtherProduct> {
    return new ProductYupValidator();
  }
}
