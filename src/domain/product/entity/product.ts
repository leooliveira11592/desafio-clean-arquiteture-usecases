import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";
import ProductInterface from "./product.interface";
import ProductValidatorFactory from "../factory/product.validator.factory";

export default class Product extends Entity implements ProductInterface {
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate();
    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors());
    }
  }

  /*
  get id(): string {
    return this._id;
  }
  */
 
  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  changeName(name: string): void {
    this._name = name;
    //this.validate();
  }

  changePrice(price: number): void {
    this._price = price;
    //this.validate();
  }

  /*
  validate() {
    ProductValidatorFactory.create().validate(this);
  }
  */
  
  validate(): boolean {

    var messageErrorAccumulated:string = "";

    if (this._id.length === 0) {
      // throw new Error("Id is required");
      if (messageErrorAccumulated.length > 0) {
        messageErrorAccumulated += ",";
      }
      messageErrorAccumulated += "product: Id is required";
    }

    if (this._name.length === 0) {
      // throw new Error("Name is required");
      if (messageErrorAccumulated.length > 0) {
        messageErrorAccumulated += ",";
      }
      messageErrorAccumulated += "product: Name is required";
    }

    if (this._price < 0) {
      // throw new Error("Price must be greater than zero");
      if (messageErrorAccumulated.length > 0) {
        messageErrorAccumulated += ",";
      }
      messageErrorAccumulated += "product: Price must be greater than zero";
    }

    if (messageErrorAccumulated.length > 0) {
      throw new Error(messageErrorAccumulated);
    }

    return true;
  }
}
