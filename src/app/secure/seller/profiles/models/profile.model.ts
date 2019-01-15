export class ProfileModel {

    Id: string;
    Name: string;
    Type: number;
    TypeName: string;

    constructor(id: string, name: string, type: number, typeName?: string) {
        this.Id = id;
        this.Name = name;
        this.Type = type;
        this.TypeName = typeName;
    }

}
