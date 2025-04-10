import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";


const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("InvoiceFacade unit test", () => {
  it("should generate an invoice", async () => {
    const repository = MockRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const findUsecase = new FindInvoiceUseCase(repository);

    const facade = new InvoiceFacade();
    facade.registerUseCase("generate", generateUsecase);
    facade.registerUseCase("find", findUsecase);

    const input = {
      name: "Cliente 1",
      document: "123456789",
      street: "Rua A",
      number: "123",
      complement: "Apto 1",
      city: "São Paulo",
      state: "SP",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 100,
        },
        {
          id: "2",
          name: "Item 2",
          price: 200,
        },
      ],
    };

    const result = await facade.generate(input);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(input.items[0].id);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].id).toBe(input.items[1].id);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(300);
  });

  it("should find an invoice", async () => {
    const repository = MockRepository();
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const findUsecase = new FindInvoiceUseCase(repository);

    const facade = new InvoiceFacade();
    facade.registerUseCase("generate", generateUsecase);
    facade.registerUseCase("find", findUsecase);

    const mockInvoice = {
      id: { id: "1" },
      name: "Cliente 1",
      document: "123456789",
      address: {
        street: "Rua A",
        number: "123",
        complement: "Apto 1",
        city: "São Paulo",
        state: "SP",
        zipCode: "12345678",
      },
      items: [
        {
          id: { id: "1" },
          name: "Item 1",
          price: 100,
        },
      ],
      total: 100,
      createdAt: new Date(),
    };

    repository.find.mockResolvedValue(mockInvoice);

    const input = {
      id: "1",
    };

    const result = await facade.find(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe(mockInvoice.id.id);
    expect(result.name).toBe(mockInvoice.name);
    expect(result.document).toBe(mockInvoice.document);
    expect(result.address.street).toBe(mockInvoice.address.street);
    expect(result.address.number).toBe(mockInvoice.address.number);
    expect(result.address.complement).toBe(mockInvoice.address.complement);
    expect(result.address.city).toBe(mockInvoice.address.city);
    expect(result.address.state).toBe(mockInvoice.address.state);
    expect(result.address.zipCode).toBe(mockInvoice.address.zipCode);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe(mockInvoice.items[0].id.id);
    expect(result.items[0].name).toBe(mockInvoice.items[0].name);
    expect(result.items[0].price).toBe(mockInvoice.items[0].price);
    expect(result.total).toBe(mockInvoice.total);
    expect(result.createdAt).toBeDefined();
  });
}); 