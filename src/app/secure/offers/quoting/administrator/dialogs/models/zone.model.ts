export class ZoneModel {
  public id?: number;
  public name: string;
  public daneCode: string;
  constructor(name: string,
              daneCode: string,
              id?: number) {
    this.name = name;
    this.daneCode = daneCode;
    this.id = id;
  }
}
