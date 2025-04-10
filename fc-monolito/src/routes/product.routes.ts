import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from "../modules/product-adm/factory/facade.factory";

export const productRoutes = express.Router();

productRoutes.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.body.name || !req.body.purchasePrice || !req.body.stock) {
      return res.status(500).json({
        message: "Missing required fields: name, purchasePrice, and stock are required"
      });
    }

    const productFacade = ProductAdmFacadeFactory.create();
    
    const productDto = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };
    
    const output = await productFacade.addProduct(productDto);
    
    res.status(201).json(output);
  } catch (err) {
    res.status(500).json({
      message: (err as Error).message || "Something went wrong",
    });
  }
}); 