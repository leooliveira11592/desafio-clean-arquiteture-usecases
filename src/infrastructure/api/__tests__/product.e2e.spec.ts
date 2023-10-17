import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Bag",
        price: 500,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Bag");
    expect(response.body.price).toBe(500);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Bag Error",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const response1 = await request(app)
      .post("/product")
      .send({
        name: "Bag 1",
        price: 250,
      });
    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Bag 2",
        price: 300,
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/product").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);

    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe("Bag 1");
    expect(product1.price).toBe(250);

    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Bag 2");
    expect(product2.price).toBe(300);

    const listResponseXML = await request(app)
    .get("/product")
    .set("Accept", "application/xml")
    .send();

    expect(listResponseXML.status).toBe(200);
    expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    expect(listResponseXML.text).toContain(`<products>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Bag 1</name>`);
    expect(listResponseXML.text).toContain(`<price>250</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`<product>`);
    expect(listResponseXML.text).toContain(`<name>Bag 2</name>`);
    expect(listResponseXML.text).toContain(`<price>300</price>`);
    expect(listResponseXML.text).toContain(`</product>`);
    expect(listResponseXML.text).toContain(`</products>`);
    
  });
});
