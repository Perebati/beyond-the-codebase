import * as yup from "yup";
import { ValidatorInterface } from "../../@shared/validator/ValidatorInterface";
import { OtherProduct } from "../entity/OtherProduct";
import { Product } from "../entity/Product";

export class ProductYupValidator implements ValidatorInterface<Product | OtherProduct> {
  validate(entity: Product | OtherProduct): void {
    try {
      yup.object().shape({
        id: yup.string().required('Id is required'),
        name: yup.string().required('Name is required'),
        price: yup.number().required('Price is required'),
      }).validateSync({
        id: entity.id,
        name: entity.name,
        price: entity.price,
      }, {
        abortEarly: false,
      });
    } catch (errors) {
      const yupErrors = errors as yup.ValidationError;
      yupErrors.errors.forEach((error) => {
        entity.notification.addError({
          context: 'product',
          message: error,
        });
      });
    }
  }
}
