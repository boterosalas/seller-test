export class ShippingMethodsModel {
  Id?: number;
  Name: string;
  Icon: string;
  constructor( Name: string,
               Icon: string,
               Id?: number ) {
    this.Id = Id;
    this.Icon = Icon;
    this.Name = Name;
  }
}
