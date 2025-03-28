import { Product } from "../../../domain/product/entity/Product";
import { ProductFactory } from "../../../domain/product/factory/ProductFactory";
import { ProductInterface } from "../../../domain/product/repository/ProductInterface";
import { InputCreateProductDto, OutputCreateProductDto } from "./CreateProductDto";

export class CreateProductUseCase {
  private productRepository: ProductInterface;

  constructor(productRepository: ProductInterface) {
    this.productRepository = productRepository;
  }

  async execute(input: InputCreateProductDto): Promise<OutputCreateProductDto> {
    const productFactory = ProductFactory.create(
      input.type,
      input.name,
      input.price,
    );

    const product = new Product(
      productFactory.id,
      productFactory.name,
      productFactory.price,
    );

    await this.productRepository.create(product);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
    }
  }
}
