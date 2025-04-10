import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address";
import InvoiceItem from "./invoice-item";
import Invoice from "./invoice";

describe("Invoice unit tests", () => {
  it("should create an invoice with id", () => {
    const id = new Id("1");
    const address = new Address(
      "Rua A",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "12345678"
    );
    const items = [
      new InvoiceItem({
        id: new Id("1"),
        name: "Item 1",
        price: 100,
      }),
      new InvoiceItem({
        id: new Id("2"),
        name: "Item 2",
        price: 200,
      }),
    ];

    const invoice = new Invoice({
      id,
      name: "Cliente 1",
      document: "123456789",
      address,
      items,
    });

    expect(invoice.id).toBe(id);
    expect(invoice.name).toBe("Cliente 1");
    expect(invoice.document).toBe("123456789");
    expect(invoice.address).toBe(address);
    expect(invoice.items).toBe(items);
    expect(invoice.total).toBe(300);
    expect(invoice.createdAt).toBeDefined();
    expect(invoice.updatedAt).toBeDefined();
  });

  it("should create an invoice without id", () => {
    const address = new Address(
      "Rua A",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "12345678"
    );
    const items = [
      new InvoiceItem({
        id: new Id("1"),
        name: "Item 1",
        price: 100,
      }),
    ];

    const invoice = new Invoice({
      name: "Cliente 1",
      document: "123456789",
      address,
      items,
    });

    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe("Cliente 1");
    expect(invoice.document).toBe("123456789");
    expect(invoice.address).toBe(address);
    expect(invoice.items).toBe(items);
    expect(invoice.total).toBe(100);
    expect(invoice.createdAt).toBeDefined();
    expect(invoice.updatedAt).toBeDefined();
  });
}); 