export class CategoryModel {
    Id: number;
    Name: string;
    IdParent: number;
    ProductType: string;
    Son: CategoryModel[];
    Show = true;
    constructor(
        name: string,
        idParent: number,
        productType: string,
        son?: CategoryModel[],
        id?: number
    ) {
        this.Id = id;
        this.Name = name;
        this.IdParent = idParent;
        this.ProductType = productType;
        this.Son = son;
    }

}
