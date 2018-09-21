/** Class type transport to define atributes of types */
export class TypeTransportModel {
  id?: number;
  name: string;
  constructor(
    name: string,
    id?: number
  ) {
    this.id = id;
    this.name = name;
  }
}
