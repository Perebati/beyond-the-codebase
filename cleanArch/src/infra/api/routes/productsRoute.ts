import express, { Request, Response } from 'express';
import { CreateProductUseCase } from '../../../usecase/product/create/CreateProductUseCase';
import { FindProductUseCase } from '../../../usecase/product/find/FindProductUseCase';
import { ListProductUseCase } from '../../../usecase/product/list/ListProductUseCase';
import { ProductRepository } from '../../product/repository/sequelize/ProductRepository';

export const productsRoute = express.Router();

productsRoute.post('/', async (req: Request, res: Response) => {
  const usecase = new CreateProductUseCase(new ProductRepository());

  try {
    const productDto = {
      type: req.body.type,
      name: req.body.name,
      price: req.body.price,
    };

    const output = await usecase.execute(productDto);
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

productsRoute.get('/', async (req: Request, res: Response) => {
  const usecase = new ListProductUseCase(new ProductRepository());

  try {
    const output = await usecase.execute({});
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

productsRoute.get('/:id', async (req: Request, res: Response) => {
  const usecase = new FindProductUseCase(new ProductRepository());

  try {
    const output = await usecase.execute({ id: req.params.id });
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});
