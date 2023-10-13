import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";


describe("Test find product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const product = new Product("123", "Notebook B", 3000);
    product.changePrice(3250);

    await productRepository.create(product);

    const input = {
      id: "123",
    };

    const output = {
      id: "123",
      name: "Notebook B",
      price: 3250,
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });
});
