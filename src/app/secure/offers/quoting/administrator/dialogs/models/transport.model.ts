/** Class transport to define atributes of transports */
export class TransportModel {
  id?: number;
  name: string;
  method: string;
  idMethod?: number;
  constructor(
    name: string,
    method: string,
    idMethod?: number,
    id?: number
  ) {
    this.id = id;
    this.name = name;
    this.method = method;
    this.idMethod = idMethod;
  }
}
