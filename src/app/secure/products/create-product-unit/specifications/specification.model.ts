export class SpecificationModel {

    Id?: number;
    Name: string;
    Show: boolean;
    Sons: SpecificationModel[];
    IdParent?: number;

    constructor(
        Name: string,
        Show: boolean,
        Sons?: SpecificationModel[],
        Id?: number,
        IdParent?: number) {
        this.Id = Id;
        this.IdParent = IdParent;
        this.Show = Show;
        this.Sons = Sons;
        this.Name = Name;
    }

    /**
     * Funcion para obtener del JSON el model con las especificaciones
     *
     * @param {*} json
     * @returns {SpecificationModel[]}
     * @memberof SpecificationModel
     */
    public changeJsonToSpecificationModel(json: any): SpecificationModel[] {
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
            specification.Name,
            false,
            specification.Hijos,
            specification.Id
        );
        // this.getSons(json, specification.IdParent);
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
    public getSons(json: any, idParent: number): SpecificationModel[] {
        const specificationList: SpecificationModel[] = [];
        json.forEach(data => {
            if (data.IdParent === idParent) {
                specificationList.push(
                    new SpecificationModel(
                        data.Name,
                        false,
                        data.Hijos,
                        data.Id
                    )
                );
            }
        });
        return null;
    }
}
