import { RepositoryInterface } from "../../@shared/repository/RepositoryInterface";
import { Product } from "../entity/Product";

export interface ProductInterface extends RepositoryInterface<Product> {}
