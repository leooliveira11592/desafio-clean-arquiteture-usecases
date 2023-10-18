import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import Product from "../../../domain/product/entity/product";
import CreateProductUseCase from "./create.product.usecase";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";


describe("Test create product use case", () => {
  var product = new Product("123", "Notebook B", 3000);
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    const output = await productCreateUseCase.execute(product);

    expect(output).toEqual({
      id: expect.any(String),
      name: product.name,
      price: product.price,
    });
  });

  it("should thrown an error when name is missing", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);

    product.changeName("");

    await expect(productCreateUseCase.execute(product)).rejects.toThrowError(
      "product: Name is required"
    );
  });

  it("should thrown an error when price smaller than zero", async () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    
    product.changePrice(-1);
    product.changeName("Notebook");

    await expect(productCreateUseCase.execute(product)).rejects.toThrowError(
      "product: Price must be greater than zero"
    );
  });

  it("should throw error when name is empty and price is smaller than zero", () => {
    const productRepository = new ProductRepository();
    const productCreateUseCase = new CreateProductUseCase(productRepository);
    
    product.changePrice(-1);
    product.changeName("");

    expect(productCreateUseCase.execute(product)).rejects.toThrowError(
      "product: Name is required,product: Price must be greater than zero"
    );
  });
});
