import express, { Request, Response } from "express";
import { PlaceOrderFacadeFactory } from "../modules/checkout/factory/place-order.facade.factory";
import { v4 as uuidv4 } from "uuid";

export const checkoutRoutes = express.Router();

checkoutRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const checkoutFacade = PlaceOrderFacadeFactory.create();
    
    const orderDto = {
      id: uuidv4(),
      clientId: req.body.clientId,
      products: req.body.products,
    };
    
    const output = await checkoutFacade.placeOrder(orderDto);
    
    res.status(201).json({
      id: output.id,
      invoiceId: output.invoiceId,
      status: output.status,
      total: output.total
    });
  } catch (err) {
    res.status(500).json({
      message: (err as Error).message || "Something went wrong",
    });
  }
}); 