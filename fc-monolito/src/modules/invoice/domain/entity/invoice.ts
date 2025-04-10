import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-object/address";
import InvoiceItem from "./invoice-item";

export default class Invoice {
  private _id: Id;
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: InvoiceItem[];
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: {
    id?: Id;
    name: string;
    document: string;
    address: Address;
    items: InvoiceItem[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = props.id || new Id();
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
  }

  get id(): Id {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): InvoiceItem[] {
    return this._items;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get total(): number {
    return this._items.reduce((total, item) => total + item.price, 0);
  }
} 