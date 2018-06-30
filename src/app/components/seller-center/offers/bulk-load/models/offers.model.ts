export class ModelOffers {
    constructor(
        public EAN: any,
        public Stock: any,
        public Price: any,
        public DiscountPrice: any,
        public AverageFreightCost: any,
        public PromiseDelivery: any,
        public IsFreeShipping: any,
        public IsEnviosExito: any,
        public IsFreightCalculator: any,
        public Warranty: any,
        public errorRow: boolean,
        public errorColumn1?: boolean,
        public errorColumn2?: boolean,
        public errorColumn3?: boolean,
        public errorColumn4?: boolean,
        public errorColumn5?: boolean,
        public errorColumn6?: boolean,
        public errorColumn7?: boolean,
        public errorColumn8?: boolean,
        public errorColumn9?: boolean,
        public errorColumn10?: boolean
    ) { }
}
