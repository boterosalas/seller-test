/** Class transport to define atributes of transports */
export class TransportModel {
  Id?: number;
  Name: string;
  Method: string;
  IdShippingMethod?: number;
  constructor(
    name: string,
    method: string,
    IdShippingMethod?: number,
    id?: number
  ) {
    this.Id = id;
    this.Name = name;
    this.Method = method;
    this.IdShippingMethod = IdShippingMethod;
  }
}
