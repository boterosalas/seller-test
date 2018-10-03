/** Class type transport to define atributes of types */
export class TypeTransportModel {
  Id?: number;
  name: string;
  constructor(
    name: string,
    id?: number
  ) {
    this.Id = id;
    this.name = name;
  }
}
