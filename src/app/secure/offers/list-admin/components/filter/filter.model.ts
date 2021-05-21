export class ModelFilter {
  constructor(
      public ean?: any,
      public product?: any,
      public stock?: any,
      public currentPage?: any,
      public limit?: any,
      public IdSeller?: string,
      public pluVtex?: any,
      public reference?: any,
      public sellerSku?: any
  ) { }

  /**
   * @description Metodo para limpiar los valores del array
   * @method clear
   * @memberof ModelFilter
   */
  clear() {
      this.ean = undefined;
      this.product = undefined;
      this.stock = undefined;
      this.currentPage = undefined;
      this.limit = undefined;
      this.pluVtex = undefined;
      this.sellerSku = undefined;
      this.reference = undefined;
  }
}
