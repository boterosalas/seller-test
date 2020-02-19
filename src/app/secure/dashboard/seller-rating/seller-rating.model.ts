export class ModelFilterSellerRating {
    constructor(
        public sellerId?: any,
        public datequalificationinitial?: any,
        public dateQualificationFinal?: any,
        public generatedDateInitial?: any,
        public generatedDateFinal?: any,
        public paginationToken?: any,
        public limit?: any,
    ) { }

    /**
     * @description Metodo para limpiar los valores del array
     * @method clear
     * @memberof ModelFilter
     */
    clear() {
        this.sellerId = undefined;
        this.datequalificationinitial = undefined;
        this.dateQualificationFinal = undefined;
        this.generatedDateInitial = undefined;
        this.generatedDateFinal = undefined;
        this.paginationToken = undefined;
        this.limit = undefined;
    }
}
