import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";


describe("Test update product use case", () => {
  const product = ProductFactory.create(
    "a",
    "Notebook",
    5555
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

  it("should update a product", async () => {
    const newPrice:number = 3722;

    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);
    
    const outputCreate = await productCreateUseCase.execute(product);

    let productToChange: Product = new Product(outputCreate.id, outputCreate.name, outputCreate.price);

    productToChange.changePrice(newPrice);

    const output = await productUpdateUseCase.execute(productToChange);

    expect(output.price).toEqual(newPrice);
  });
});
