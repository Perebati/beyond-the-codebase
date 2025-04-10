import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../modules/@shared/domain/value-object/address";
import { v4 as uuidv4 } from "uuid";

export const clientRoutes = express.Router();

clientRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const clientFacade = ClientAdmFacadeFactory.create();
    
    const clientId = req.body.id || uuidv4();
    
    const address = new Address(
      req.body.street,
      req.body.number,
      req.body.complement,
      req.body.city,
      req.body.state,
      req.body.zipCode
    );
    
    const clientDto = {
      id: clientId,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: address
    };
    
    await clientFacade.add(clientDto);
    
    res.status(201).json({
      id: clientId,
      name: req.body.name,
      email: req.body.email,
      document: req.body.document
    });
  } catch (err) {
    res.status(500).json({
      message: (err as Error).message || "Something went wrong",
    });
  }
}); 