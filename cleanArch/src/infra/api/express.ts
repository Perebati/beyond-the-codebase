import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { productsRoute } from './routes/productsRoute';
import { CustomerModel } from '../customer/db/model/CustomerModel';
import { ProductModel } from '../product/db/model/ProductModel';
import { customersRoute } from './routes/customersRoute';

export const app: Express = express();
app.use(express.json());
app.use('/customers', customersRoute);
app.use('/products', productsRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  sequelize.addModels([CustomerModel, ProductModel]);
  await sequelize.sync();
}

setupDb();
