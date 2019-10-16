export class ModelFilterProducts {
    constructor(
        public ean?: any,
        public productName?: any,
        public creationDate?: any,
        public initialDate?: any,
        public finalDate?: any,
        public page?: any,
        public limit?: any,
        public PluVtex?: any
        ) { }

    /**
     * @description Metodo para limpiar los valores del array
     * @method clear
     * @memberof ModelFilter
     */
    clear() {
        this.ean = undefined;
        this.productName = undefined;
        this.creationDate = undefined;
        this.initialDate = undefined;
        this.finalDate = undefined;
        this.page = undefined;
        this.limit = undefined;
        this.PluVtex = undefined;
    }
}
