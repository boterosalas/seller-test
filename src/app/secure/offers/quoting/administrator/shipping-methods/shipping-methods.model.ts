export class ShippingMethodsModel {
  id?: number;
  nameShippingMethod: string;
  iconMethod: string;
  constructor( nameShippingMethod: string,
               iconMethod: string,
               id?: number ) {
    this.id = id;
    this.iconMethod = iconMethod;
    this.nameShippingMethod = nameShippingMethod;
  }
}
