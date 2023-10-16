import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";


describe("Test list product use case", () => {
  const product1 = ProductFactory.create(
    "a",
    "Notebook A",
    2000
  );

  const product2 = ProductFactory.create(
    "b",
    "Notebook B",
    4000
  );
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

  it("should list a product", async () => {

    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output1 = await productCreateUseCase.execute(product1);
    const output2 = await productCreateUseCase.execute(product2);

    const productListUseCase = new ListProductUseCase(productRepository);

    const output = await productListUseCase.execute({product1, product2});

    expect(output.products.length).toBe(2);
    
    expect(output.products[0].id).toBe(output1.id);
    expect(output.products[0].name).toBe(output1.name);
    expect(output.products[0].price).toBe(output1.price);

    expect(output.products[1].id).toBe(output2.id);
    expect(output.products[1].name).toBe(output2.name);
    expect(output.products[1].price).toBe(output2.price);
  });
});
