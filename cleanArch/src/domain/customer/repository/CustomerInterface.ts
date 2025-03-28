import { RepositoryInterface } from "../../@shared/repository/RepositoryInterface";
import { Customer } from "../entity/Customer";

export interface CustomerInterface extends RepositoryInterface<Customer> {}
