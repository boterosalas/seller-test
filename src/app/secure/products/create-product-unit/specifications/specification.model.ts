export class SpecificationModel {

    Id?: number;
    Name: string;
    Value: string;
    Show: boolean;
    Sons: SpecificationModel[];
    List: SpecificationModel[];
    IdParent?: number;
    Obligatory = false;
    // Sons se refiere a las especificaciones ya que es un modelo
    constructor(
        Name: string,
        Show: boolean,
        Sons?: SpecificationModel[],
        Id?: number,
        IdParent?: number,
        List?: SpecificationModel[],
        Obligatory?: boolean) {
        this.Id = Id;
        this.IdParent = IdParent;
        this.Show = Show;
        this.Sons = Sons;
        this.List = List;
        this.Name = Name;
        this.Obligatory = Obligatory;
    }

    /**
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
        model = new SpecificationModel(
            specification.groupName,
            false,
            this.getSons(specification.specs ),
            specification.idGroup
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
                specificationList.push(
                    new SpecificationModel(
                        data.specName,
                        false,
                        null,
                        data.idSpec,
                        null,
                        data.list,
                        data.obligatory
                    )
                );
        });
        return specificationList;
    }
}
