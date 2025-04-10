import Address from "./address";

describe("Address unit tests", () => {
  it("should create an address", () => {
    const address = new Address(
      "Rua A",
      "123",
      "Apto 1",
      "São Paulo",
      "SP",
      "12345678"
    );

    expect(address.street).toBe("Rua A");
    expect(address.number).toBe("123");
    expect(address.complement).toBe("Apto 1");
    expect(address.city).toBe("São Paulo");
    expect(address.state).toBe("SP");
    expect(address.zipCode).toBe("12345678");
  });
}); 