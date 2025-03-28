import { Sequelize } from "sequelize-typescript";
import { UpdateCustomerUseCase } from "./UpdateCUstomerUseCase";
import { CustomerModel } from "../../../infra/customer/db/model/CustomerModel";
import { Customer } from "../../../domain/customer/entity/Customer";
import { Address } from "../../../domain/customer/valueObject/Address";
import { CustomerRepository } from "../../../infra/customer/repository/sequelize/CustomerRepository";

describe('Integration test update use case', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer('123', 'John Doe');
    const address = new Address("Street 1", 100, "City 1", "State 1", "ZipCode 1");
    customer.setAddress(address);

    await customerRepository.create(customer);

    const input = {
      id: customer.id,
      name: 'John Doe 2',
      address: {
        street: 'Street 2',
        number: 200,
        city: 'City 2',
        state: 'State 2',
        zipCode: 'ZipCode 2',
      }
    };

    const usecase = new UpdateCustomerUseCase(customerRepository);
    const output = await usecase.execute(input);

    expect(output).toStrictEqual(input);
  });
});
