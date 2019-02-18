import { FunctionalityModel } from './funcionality.model';

export class MenuModel {
    Id: string;
    Name: string;
    Functionalities: FunctionalityModel[];
    NameModule: string;
    ProfileType: string;
    constructor(id: string,
        name: string,
        functionalities: FunctionalityModel[],
        nameModule: string,
        profileType: string) {
        this.Id = id;
        this.Name = name;
        this.Functionalities = functionalities;
        this.NameModule = nameModule;
        this.ProfileType = profileType;
    }

    ValidateData(data: any): any {
        let validateData: MenuModel[];
        const modulesData = [];
        if (data) {
            data.forEach(element => {
                validateData = [];
                if (element && element.Menus) {
                    element.Menus.forEach(menu => {
                        validateData.push(this.dataMenuFromService(menu, element.Name));
                    });
                }
                modulesData.push({
                    Name: element.Name,
                    Menus: validateData,
                    ProfileType: element.ProfileType
                });
            });
        }
        return modulesData;
    }

    private dataMenuFromService(data: any, nameModule: string): MenuModel {
        return new MenuModel(
            data.idMenu,
            data.Name,
            this.ValidateFunctionalityData(data.Actions),
            nameModule,
            data.ProfileType
        );
    }

    public ValidateFunctionalityData(data: any): FunctionalityModel[] {
        let validateData: FunctionalityModel[];
        validateData = [];
        if (data) {
            data.forEach(element => {
                validateData.push(this.dataFunctionalityFromService(element));
            });
        }
        return validateData;
    }

    private dataFunctionalityFromService(data: any): FunctionalityModel {
        return new FunctionalityModel(
            data.id,
            data
        );
    }
}
