export class ZoneModel {
  public Id?: number;
  public Name: string;
  public DaneCode: string;
  constructor(Name: string,
              DaneCode: string,
              Id?: number) {
    this.Name = Name;
    this.DaneCode = DaneCode;
    this.Id = Id;
  }
}
