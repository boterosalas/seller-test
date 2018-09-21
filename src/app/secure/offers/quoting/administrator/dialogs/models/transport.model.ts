/** Class transport to define atributes of transports */
export class TransportModel {
  id?: number;
  name: string;
  idMethod: string;
  constructor(
    name: string,
    idMethod: string,
    id?: number
  ) {
    this.id = id;
    this.name = name;
    this.idMethod = idMethod;
  }
}
