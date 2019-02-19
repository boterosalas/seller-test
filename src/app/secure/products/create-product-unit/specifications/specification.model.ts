export class SpecificationModel {

    Id?: number;
    Name: string;
    Value: string;
    Show: boolean;
    Sons: SpecificationModel[];
    IdParent?: number;
    List?: String[];
    Categories?: String[];
    Required?: boolean;
    Obligatory = false;
    // Sons se refiere a las especificaciones ya que es un modelo
    constructor(
        Name: string,
        Show: boolean,
        Sons?: SpecificationModel[],
        Id?: number,
        IdParent?: number,
        List?: String[],
        Categories?: String[],
        Required?: boolean) {
        this.Id = Id;
        this.IdParent = IdParent;
        this.Show = Show;
        this.Sons = Sons;
        this.List = List;
        this.Name = Name;
        this.Categories = Categories;
        this.Required = Required;
        }
    /*
     * Funcion para obtener del JSON el model con las especificaciones
     *
     * @param {*} json
     * @returns {SpecificationModel[]}
     * @memberof SpecificationModel
     */
    changeJsonToSpecificationModel(json: any): SpecificationModel[] {
        const specificationList: SpecificationModel[] = [];
        json.forEach(data => {
            specificationList.push(this.castingJsonToModel(data, json));
        });
        return specificationList;
    }

    /**
     * Funcion para castear los datos a modelo de especificaciones.
     *
     * @param {*} specification
     * @param {*} json
     * @returns {SpecificationModel}
     * @memberof SpecificationModel
     */
    public castingJsonToModel(specification: any, json: any): SpecificationModel {
        let model: SpecificationModel;
        let categories = null;
        if (specification.categories) {
            categories = JSON.parse(specification.categories);
        }
        model = new SpecificationModel(
            specification.groupName,
            false,
            this.getSons(specification.specs),
            specification.idGroup,
            null,
            null,
            categories
        );
        return model;
    }

    /**
     * Funcion para obtener las especificaciones de grupos.
     *
     * @param {*} json
     * @param {number} idParent
     * @returns {SpecificationModel[]}
     * @memberof SpecificationModel
     */
    public getSons(json: any): SpecificationModel[] {
        const specificationList: SpecificationModel[] = [];
        json.forEach(data => {
            let values = null;
            if (data.values) {
                values = JSON.parse(data.values);
            }
            specificationList.push(
                new SpecificationModel(
                    data.specName,
                    false,
                    null,
                    data.idSpec,
                    null,
                    values,
                    null,
                    data.required
                )
            );
        });
        return specificationList;
    }
}
