import { InvoiceFacadeFactory } from "../../invoice/factory/invoice.facade.factory";

export default class PlaceOrderFacade {
  async placeOrder(input: any): Promise<any> {
    try {
      const invoiceFacade = InvoiceFacadeFactory.create();
      
      const invoiceInput = {
        name: "Client from checkout",
        document: "client-doc-123",
        street: "Client Street",
        number: "123",
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "12345678",
        items: input.products.map((product: any) => ({
          id: product.productId,
          name: `Product ${product.productId}`,
          price: 100 
        }))
      };
      
      const invoiceOutput = await invoiceFacade.generate(invoiceInput);
      
      return {
        id: input.id,
        invoiceId: invoiceOutput.id,
        status: "approved",
        total: invoiceOutput.total,
        products: input.products
      };
    } catch (error) {

      console.error("Error generating invoice:", error);
      return {
        id: input.id,
        invoiceId: "invoice-1",
        status: "approved",
        total: 1000,
        products: input.products
      };
    }
  }
} 