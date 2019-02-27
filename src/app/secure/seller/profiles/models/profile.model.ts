import { MenuModel } from './menu.model';

export class ProfileModel {

    Id: string;
    Name: string;
    Type: number;
    TypeName: string;
    Menus: MenuModel[];
    constructor(id: string, name: string, type: number, typeName?: string, menu?: MenuModel[]) {
        this.Id = id;
        this.Name = name;
        this.Type = type;
        this.TypeName = typeName;
        this.Menus = menu;
    }

}
