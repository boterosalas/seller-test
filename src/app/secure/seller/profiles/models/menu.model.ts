import { FunctionalityModel } from './funcionality.model';

export class MenuModel {
    Id: string;
    Name: string;
    Functionalities: FunctionalityModel[];
    NameModule: string;
    constructor(id: string,
                name: string,
                functionalities: FunctionalityModel[],
                nameModule: string) {
        this.Id = id;
        this.Name = name;
        this.Functionalities = functionalities;
        this.NameModule = nameModule;
    }

    ValidateData(data: any): MenuModel[] {
        let validateData: MenuModel[];
        validateData = [];
        data.forEach(element => {
            validateData.push(this.dataMenuFromService(element));
        });
        return validateData;
    }

    private dataMenuFromService(data: any): MenuModel {
        return new MenuModel(
            data.idMenu,
            data.nameMenu,
            this.ValidateFunctionalityData(data.funcionalities),
            data.nameModule
        );
    }

    public ValidateFunctionalityData(data: any): FunctionalityModel[] {
        let validateData: FunctionalityModel[];
        validateData = [];
        data.forEach(element => {
            validateData.push( this.dataFunctionalityFromService(element) );
        });
        return validateData;
    }

    private dataFunctionalityFromService(data: any): FunctionalityModel {
        return new FunctionalityModel(
            data.id,
            data.name
        );
    }
}
