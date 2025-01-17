export class ModelProduct {
    constructor(
        public Ean: any,
        public Name: any,
        public Category: any,
        public Brand: any,
        public Description: any,
        public MetaTitle: any,
        public MetaDescription: any,
        public KeyWords: any,
        public PackageHeight: any,
        public PackageLength: any,
        public PackageWidth: any,
        public PackageWeight: any,
        public SkuShippingSize: any,
        public ProductHeight: any,
        public ProductLength: any,
        public ProductWidth: any,
        public ProductWeight: any,
        public Seller: any,
        public ProductType: any,
        public Size: any,
        public Color: any,
        public HexColourName: any,
        public IsLogisticsExito: any,
        public ImageUrl1: any,
        public ImageUrl2?: any,
        public ImageUrl3?: any,
        public ImageUrl4?: any,
        public ImageUrl5?: any,
        public MeasurementUnit?: any,
        public ConversionFactor ?: any,
        public DrainedFactor?: any,
        public ParentReference?: any,
        public SonReference?: any,
        public ModifyImage?: any,
        public isVariant?: boolean,
        public EanCombo?: any,
        public videoUrl?: any,
        public errorRow?: boolean,
        public errorEan?: boolean,
        public errorName?: boolean,
        public errorCategory?: any,
        public errorBrand?: any,
        public errorDescription?: any,
        public errorMetaTitle?: any,
        public errorMetaDescription?: any,
        public errorKeyWords?: any,
        public errorPackageHeight?: any,
        public errorPackageLength?: any,
        public errorPackageWidth?: any,
        public errorPackageWeight?: any,
        public errorSkuShippingSize?: any,
        public errorProductHeight?: any,
        public errorProductLength?: any,
        public errorProductWidth?: any,
        public errorProductWeight?: any,
        public errorSeller?: any,
        public errorProductType?: any,
        public errorImageUrl1?: any,
        public errorImageUrl2?: any,
        public errorImageUrl3?: any,
        public errorImageUrl4?: any,
        public errorImageUrl5?: any,
        public errorMeasurementUnit?: any,
        public errorConversionFactor ?: any,
        public errorDrainedFactor?: any,
        public errorParentReference?: any,
        public errorSonReference?: any,
        public errorModifyImage?: any,
        public errorSize?: any,
        public errorColor?: any,
        public errorHexColourName?: any,
        public errorIsLogisticsExito?: any,
        public errorEanCombo?: any,
        public errorvideoUrl?: any
    ) { }
}

export class AbaliableLoadModel {
    constructor(
        public amountAvailableLoads?: number,
        public amountSuccessfulLoads?: number,
        public maximumAvailableLoads?: number
    ) { }
}

