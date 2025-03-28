import { ValidatorInterface } from "../../@shared/validator/ValidatorInterface";
import { Customer } from "../entity/Customer";
import { CustomerYupValidator } from "../validator/CustomerYupValidator";

export class CustomerValidatorFactory {
  static create(): ValidatorInterface<Customer> {
    return new CustomerYupValidator();
  }
}
