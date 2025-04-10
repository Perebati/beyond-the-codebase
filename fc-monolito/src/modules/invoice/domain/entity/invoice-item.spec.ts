import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice-item";

describe("InvoiceItem unit tests", () => {
  it("should create an invoice item with id", () => {
    const id = new Id("1");
    const invoiceItem = new InvoiceItem({
      id,
      name: "Item 1",
      price: 100,
    });

    expect(invoiceItem.id).toBe(id);
    expect(invoiceItem.name).toBe("Item 1");
    expect(invoiceItem.price).toBe(100);
  });

  it("should create an invoice item without id", () => {
    const invoiceItem = new InvoiceItem({
      name: "Item 1",
      price: 100,
    });

    expect(invoiceItem.id).toBeDefined();
    expect(invoiceItem.name).toBe("Item 1");
    expect(invoiceItem.price).toBe(100);
  });
}); 