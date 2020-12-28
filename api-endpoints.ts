export const defaultVersion = {
  prefix: 'v',
  number: 1
};

export const endpoints = {
  // Endpoints QA
  stage: {
    v1: {
      // orders
      sendOrderEmail: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/exportoffersbyseller/{idSeller}/{email}',
      searchOrders: 'https://5x9qrupiba.execute-api.us-east-1.amazonaws.com/SearchOrders?idSeller={sellerId}&limit={limit}',
      carries: 'https://2he495iasj.execute-api.us-east-1.amazonaws.com/Carries',
      sendAllGuides: 'https://tew99ut1y2.execute-api.us-east-1.amazonaws.com/SendAllGuides',
      downloadOrder: 'https://z0vz1c608a.execute-api.us-east-1.amazonaws.com/DownloadOrder',
      sendAllProductInOrder: 'https://nnsfw2fjr7.execute-api.us-east-1.amazonaws.com/SendAllProductInOrder/{orderId}',
      sendProductInOrder: 'https://89qu0cyz29.execute-api.us-east-1.amazonaws.com/SendProductInOrder/{orderId}/{idDetailProduct}',
      searchPendingDevolution: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch?{stringParams}',
      pendingDevolution: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch?{stringParams}',
      pendingDevolutionSearchTemporal: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch?{stringParams}',
      acceptOrDeniedDevolution: 'https://v1kfqoa8yd.execute-api.us-east-1.amazonaws.com/RequestAcceptOrDenied',
      recordProcesSedOrder: 'https://4nu4lf5m80.execute-api.us-east-1.amazonaws.com/RecordProcesSedOrder',
      getallordersbysellerwithouttracking: 'https://cbihc9u6fa.execute-api.us-east-1.amazonaws.com/GetAllOrdersBySellerWithoutTracking{stringParam}',
      validateStatusLoadGuide: 'https://tew99ut1y2.execute-api.us-east-1.amazonaws.com/SendAllGuides/status',
      getBilling: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing{stringParams}',
      exportBillingPays: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing',
      searchBilling: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing?idSeller={sellerId}&limit={limit}',
      refuseOrAcceptDevolution: '',
      // Support message
      supporMessage: 'https://iqbs3e9dyb.execute-api.us-east-1.amazonaws.com/CreateSupport',
      createcaseseller: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/createcaseseller',
      getreasonsrejection: 'https://g7n20mhxc4.execute-api.us-east-1.amazonaws.com/ReasonsRejection{stringParams}',
      // shipments
      getShipmentById: 'service/shipping/{id}',
      listShipments: 'service/shipping/list/state/{state}/from/{from}/to/{take}/order/{sort}/carrier/{carrier}/',
      pickupShipment: 'service/shipping/pickup',
      // servicios para el arbol de categorías
      getAllSellersFull: 'https://5m0vgt1hi5.execute-api.us-east-1.amazonaws.com/GetAllSellers',
      getAllSellers: 'https://9d5now9dr2.execute-api.us-east-1.amazonaws.com/getnameallSeller/1',
      getAllSellersPaginated: 'https://5m0vgt1hi5.execute-api.us-east-1.amazonaws.com/GetAllSellers/paginated?limit={limit}',
      // servicio empleado para obtener las comisiones de un usuario o todas las comisiones
      getSellerCommissionCategory: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory/GetAllCategories',
      // Ruta base para la modificación de las categorías
      manageCategory: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory',
      // Consulta el estado de creación de una categoria
      statusCreateCategory: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory/GetStatusLoadCommissionCategory',
      // Register Seller Name
      registerSeller: 'https://5a1c7n6t70.execute-api.us-east-1.amazonaws.com/RegisterSeller/',
      validateSellerNit: 'https://5avfpnwghf.execute-api.us-east-1.amazonaws.com/ValidateSellerNit/{params}',
      validateSellerEmail: 'https://iye9w7rlsg.execute-api.us-east-1.amazonaws.com/ValidateSellerEmail/{params}',
      validateSellerName: 'https://4gxrzfojb9.execute-api.us-east-1.amazonaws.com/ValidateSellerName/{params}',
      // Cities and States services
      // getCities: 'https://u9rxwf1i19.execute-api.us-east-1.amazonaws.com/Cities/{params}', original
      getCities: 'https://u9rxwf1i19.execute-api.us-east-1.amazonaws.com/Cities/GetCitiesByState/{params}',
      getCitiesCoverage: 'https://u9rxwf1i19.execute-api.us-east-1.amazonaws.com/Cities/GetAllCitiesVtexS3',
      getDaneCodesNonCoverage: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/GetSellerData',
      getStates: 'https://vppc3gie2i.execute-api.us-east-1.amazonaws.com/States',
      pacthCitiesNoCoverage: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/UpdateCitiesNonCoverage',
      // Offers
      getOffers: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/{params}',
      getOffersAdmin: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/listoffersbyseller/{params}',
      patchOffers: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer',
      patchOffersProducts: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/registeruniqueoffer',
      getStatusOffers: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/status',
      // Historical
      getHistoricalOffers: 'https://27tkfc1vv8.execute-api.us-east-1.amazonaws.com/OfferHistorical/{params}',
      downloadHistorical: 'https://v40mzsj5hk.execute-api.us-east-1.amazonaws.com/OfferDownloadHistorical/{params}',
      // Historical admin
      getHistoricalOffersAdmin: 'https://rk6blagjy8.execute-api.us-east-1.amazonaws.com/OfferHistoricalAdmin/{params}',
      downloadHistoricalAdmin: 'https://vlaswi5ovd.execute-api.us-east-1.amazonaws.com/OfferDownloadHistoricalAdmin/{params}',
      // Products
      products: 'https://0vmlis29mk.execute-api.us-east-1.amazonaws.com/products-loads-dev/{params}',
      // Quoting
      getSendMethod: 'https://bkafj0viij.execute-api.us-east-1.amazonaws.com/ShippingMethod',
      zones: 'https://fu1opv4qtc.execute-api.us-east-1.amazonaws.com/Areas',
      getZone: 'https://fu1opv4qtc.execute-api.us-east-1.amazonaws.com/Areas/{params}',
      transports: 'https://vfblsvp0wf.execute-api.us-east-1.amazonaws.com/Transporters',
      getTransport: 'https://vfblsvp0wf.execute-api.us-east-1.amazonaws.com/Transporters/{params}',
      getSize: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/getvtexsizelist',
      getQuoting: 'https://swje0lr27g.execute-api.us-east-1.amazonaws.com/utilities-dev/shippingcostrules/GetShippingCostRules',
      createQuoting: 'https://swje0lr27g.execute-api.us-east-1.amazonaws.com/utilities-dev/shippingcostrules/CreateShippingCostRule',
      updateQuoting: 'https://swje0lr27g.execute-api.us-east-1.amazonaws.com/utilities-dev/shippingcostrules/UpdateShippingCostRule',
      deleteQuoting: 'https://swje0lr27g.execute-api.us-east-1.amazonaws.com/utilities-dev/shippingcostrules/DeleteShippingCostRule/{param}',

      // Seller
      getListSellersName: 'https://9d5now9dr2.execute-api.us-east-1.amazonaws.com/getnameallSeller/{params}',
      getSpecificSeller: 'https://5m0vgt1hi5.execute-api.us-east-1.amazonaws.com/GetAllSellers/{idseller}/{allseller}',
      updateSeller: 'https://tyss52sgm6.execute-api.us-east-1.amazonaws.com/UpdateSeller',
      changeStatusSeller: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/SetSellerAvaibality',
      cancelVacationSeller: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/CancelVacation',
      // Validar ean
      getValidateEan: 'https://g5a9j4ahbd.execute-api.us-east-1.amazonaws.com/Products/',
      // Dashboard
      getSellsSummary: 'https://nv4izavvqj.execute-api.us-east-1.amazonaws.com/OrdersSummaryStatus/{params}',
      getOrdersStatus: 'https://nv4izavvqj.execute-api.us-east-1.amazonaws.com/OrdersSummaryStatus/{params}',
      // Estado de Carga
      getStateOfCharge: 'https://0vmlis29mk.execute-api.us-east-1.amazonaws.com/products-loads-dev/',
      // Guardar logs en CloudWatch
      setCloudWatchLog: 'https://7xre4jqhqa.execute-api.us-east-1.amazonaws.com/dev/logs',
      // Validar formato imagen
      getValidateImage: 'https://3nr5ac6osg.execute-api.us-east-1.amazonaws.com/dev/ValidateImage',
      // Get specs
      getProductSpecs: 'https://bahzzzoq93.execute-api.us-east-1.amazonaws.com/products-specs-dev',
      getConfigSpecs: 'https://bahzzzoq93.execute-api.us-east-1.amazonaws.com/products-specs-dev',
      // Enviar moderación de productos al correo
      productModeration: 'https://dsaxgtixub.execute-api.us-east-1.amazonaws.com/ProductsWaiting/{params}',
      // Get Regex
      getRegexBasic: 'https://n1gy42mfqa.execute-api.us-east-1.amazonaws.com/Regex/{params}',
      // Post Guardar informacion creacion unitaria de producto
      postSaveInformationUnitCreation: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products',
      // Post solicitar informacion de detalle de productos
      postUnitSaveInformationUnitCreation: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/unitproduct',
      // Patch actualizar un producto
      patchUnitSaveInformationUnitCreation: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/unitproduct',
      // Download billing.
      exportBilling: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing',
      // Billing orders visualize.
      getBillingOrders: 'https://blmce0zwq7.execute-api.us-east-1.amazonaws.com/orders-bill/{params}',
      // Download Billing .
      postBillingOrders: 'https://blmce0zwq7.execute-api.us-east-1.amazonaws.com/orders-bill/{params}',
      // Actualizar factura
      uploadBilling: 'https://blmce0zwq7.execute-api.us-east-1.amazonaws.com/orders-bill',
      // Obtener contratos por vendedor.
      getTermsBySeller: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/GetContracts/{params}',
      // Actualizar contrato del vendedor
      updateTermsSeller: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/AcceptContract',
      // Registrar contrato por medio del administrador
      registersContract: 'https://yoix96dfrg.execute-api.us-east-1.amazonaws.com/contracts/RegisterContract',
      // Obtener si el vendedor ya acepto los terminos
      getValidationTerms: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/ValidateContract',
      // Obtener los datos del vendedor
      getSellerData: 'https://ypkstb19j4.execute-api.us-east-1.amazonaws.com/SellerCmd/GetSellerData',
      // Obtener todos los perfiles.
      getAllProfiles: 'https://77q5jco8ga.execute-api.us-east-1.amazonaws.com/Profiles/GetAllProfiles',
      // Agregar perfiles.
      createProfile: 'https://77q5jco8ga.execute-api.us-east-1.amazonaws.com/Profiles/CreateProfile',
      // Editar perfiles.
      updateProfile: 'https://77q5jco8ga.execute-api.us-east-1.amazonaws.com/Profiles/UpdateProfile',
      // Obtener todos los modulos.
      getAllModule: 'https://77q5jco8ga.execute-api.us-east-1.amazonaws.com/Profiles/GetAllModules',
      // Obtener todos los permisos.
      getPermissions: 'https://77q5jco8ga.execute-api.us-east-1.amazonaws.com/Profiles/GetUserPerminsions',
      // Obtener lista de productos
      getProductList: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/{params}',
      // Obtener especificaciones por categoria
      getSpecByCategory: 'https://bahzzzoq93.execute-api.us-east-1.amazonaws.com/products-specs-dev/{params}',
      // Obtener lista producto expandido
      getProductExpanded: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/get-product/{params}',
      // Obtener detalles del producto
      getProductDetails: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/unitproduct/{params}',
      // Obtener tipo de perfil
      getTypeProfileAndProfile: 'https://77q5jco8ga.execute-api.us-east-1.amazonaws.com/Profiles/GetTypeProfileAndProfile',
      // Payoneer
      payoneer: 'https://jokht2xtxh.execute-api.us-east-1.amazonaws.com/payoneer-dev/ValidateRegisterPayoneer',
      // Servicio carga masiva moderación productos Seller
      postSaveInformationModerationSeller: 'https://dsaxgtixub.execute-api.us-east-1.amazonaws.com/ProductsWaiting',
      // PARAMETRIZACION
      // BRANDS GET - Obtener listado de marcas creadas
      getAllBrands: 'https://hu95klta45.execute-api.us-east-1.amazonaws.com/brands-dev/GetBrands/{params}',
      // BRANDS UPDATE - Actualiza una marca
      updateBrand: 'https://hu95klta45.execute-api.us-east-1.amazonaws.com/brands-dev/UpdateBrand/{params}',
      // BRANDS CREATE - Crea una nueva marca
      createBrand: 'https://hu95klta45.execute-api.us-east-1.amazonaws.com/brands-dev/CreateBrand/{params}',
      // BRANDS CREATE - Crea una nueva marca
      validateBrandsExact: 'https://hu95klta45.execute-api.us-east-1.amazonaws.com/brands-dev/GetExactBrand/{params}',
      // get active brands
      getActiveBrands: 'https://hu95klta45.execute-api.us-east-1.amazonaws.com/brands-dev/GetBrands/',
      // get categories vetex
      getCategoriesVetex: 'https://bahzzzoq93.execute-api.us-east-1.amazonaws.com/products-specs-dev/getspecsbycategoryname/',
      // Support Seller center
      getAllStatusCase: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/get-case-status',
      getAllCase: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/casesfilteredpaged',
      getCase: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/get-case',
      patchCaseResponse: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/respondcasefollow',
      patchReadCase: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/readcase',
      getUnreadCase: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/unreadscount',
      exceptionBrandsManage: '',
      // Reporte de ofertas administrator
      reportsOfferAdmin: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/reportoffersexcel',
      // Get vtex TREET
      getVtexTree: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/getvtextree',
      // Get ordenes Pendientes
      getPendinOrders: 'https://frgj254c3l.execute-api.us-east-1.amazonaws.com/dev/sellercenter/reversions/amount',
      // Get excecion brand comisiones
      getExceptionBrand: 'https://n2o5al9s59.execute-api.us-east-1.amazonaws.com/dev',
      // Crear/Editar/Elminar comision execpcion marca
      exceptionComissionBrand: 'https://n2o5al9s59.execute-api.us-east-1.amazonaws.com/dev/{params}',
      // Classification of cases
      getCaseCategories: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/get-case-categories',
      // Obtener calificacion de vendedores
      getSellerRating: 'https://frgj254c3l.execute-api.us-east-1.amazonaws.com/dev/sellercenter/qualificationseller/{params}',
      // Eliminar calificacion de un vendedor
      upsertQualification: 'https://frgj254c3l.execute-api.us-east-1.amazonaws.com/dev/sellercenter/qualificationseller',
      // consultar las ordenes por tipo de filtros
      ordersSummaryStatus: 'https://nv4izavvqj.execute-api.us-east-1.amazonaws.com/OrdersSummaryStatus/{params}',
      // Descargar rotulos
      getDownlaodLabel: 'https://frgj254c3l.execute-api.us-east-1.amazonaws.com/dev/sellercenter/orders/{params}/sticker',
      // Obtener puertos por país
      getPortsByCountryName: 'https://orba3qnrte.execute-api.us-east-1.amazonaws.com/dispatchport/GetDispatchPortsByCountryName/{params}',
      // Get para consultar todos los estados de las ordenes
      getIdOrders: 'https://frgj254c3l.execute-api.us-east-1.amazonaws.com/dev/sellercenter/statusorders',
      // Ruta basica para puertos
      managePort: 'https://orba3qnrte.execute-api.us-east-1.amazonaws.com/dispatchport',
      // Desactivar masiva de Ofertas
      patchDesactiveOffer: 'https://1b98mqc06i.execute-api.us-east-1.amazonaws.com/Offer/disableoffersbyseller',
      // Exportar reclamaciones
      exportReclaim: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/downloadreport',
      // GetProducs para modificaciones
      getProductsPendingModify: 'https://dsaxgtixub.execute-api.us-east-1.amazonaws.com/ProductsWaiting/productsrejected?idSeller={sellerId}&limit={limit}',
      // GetProducts pendiente validacion
      getProductsPendingValidation: 'https://dsaxgtixub.execute-api.us-east-1.amazonaws.com/ProductsWaiting/productswaiting?idSeller={sellerId}&limit={limit}',
      // GetProducs by EAN para modificaciones
      getEANPendingModify: 'https://dsaxgtixub.execute-api.us-east-1.amazonaws.com/ProductsWaiting/productsrejected/{params}',
      // GetProducs by EAN para validacion
      getEANPendingValidation: 'https://dsaxgtixub.execute-api.us-east-1.amazonaws.com/ProductsWaiting/productswaiting/{params}',
      // Exportar productos
      exportProducts: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/report',
      // Listado de resumen de facturacion
      getListAllSummaryBilling: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing/summary',
      // Detalle de reclaciones
      getDetailTranslationReclaim: 'https://7y9v564dl9.execute-api.us-east-1.amazonaws.com/cases-dev/get-case-expanded/{params}',
      // Obtener comentarios de solicitud de devolución
      getAllCommentRefuse: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch/translation',
      // enviar array de archivos para ser procesados y guardados
      setMassiveBillOrderAsync: 'https://blmce0zwq7.execute-api.us-east-1.amazonaws.com/orders-bill/setmassivebillorderasync',
      // consultar status de carga masiva de facturas
      getstatussetmassivebilling: 'https://blmce0zwq7.execute-api.us-east-1.amazonaws.com/orders-bill/getstatussetmassivebilling',
      // enviar por correo un reporte con los errores en vtex
      reportErrorsVtex: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/reportfailsendvtex/{params}',
      // archivo en s3 formato carga masiva de excepcion
      uploadMasiveUpload: 'https://seller-center-exito-staging.s3.amazonaws.com/Templates-Dev/FormatChargeCommissions.xlsx',
      // verificar el estado de la carga masiva para excepciones PLU
      verificateStatusException: 'https://n2o5al9s59.execute-api.us-east-1.amazonaws.com/dev/GetMassiveComsnExcStatus',
      // enviar data en formato json al back
      sendDataJsonReadExcel: 'https://n2o5al9s59.execute-api.us-east-1.amazonaws.com/dev/MassiveComsnExc',
      // Listado de colores
      getListColor: 'https://ugv14jroji.execute-api.us-east-1.amazonaws.com/Products/colors',
      // Descargable del listado/historico de cancelaciones
      exportListCancel: 'https://nrk3ye1ppc.execute-api.us-east-1.amazonaws.com/ReversionRequestSearch/report',
      // Descargar arbol de categorías
      exporCategories: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory/GenerateReportCategories',
      // Eliminar categpria por Id
      deleteCategory: 'https://0dk55lff0l.execute-api.us-east-1.amazonaws.com/SellerCommissionCategory/DeleteCategory{params}',
      // Descargar exportar comisiones
      exportCommission: 'https://n2o5al9s59.execute-api.us-east-1.amazonaws.com/dev/ExportComsnExcsAudit/{params}',
      // Obtener el listado de comisiones ultimos 15 dias
      getListCommissionAll: 'https://n2o5al9s59.execute-api.us-east-1.amazonaws.com/dev/GetComsnExcsAudit/{params}',
      // Obtener listado de historico de pagos
      getListHistoricPayments: 'https://w7uiqlm4b6.execute-api.us-east-1.amazonaws.com/dev/detaildispersion{params}',
      // Obtener listado novedades cobro
      getListNewsCollected: 'https://w7uiqlm4b6.execute-api.us-east-1.amazonaws.com/dev/detailpaymentnews{params}',
      // Obtener el listado de vendedores para hacer la dispersion
      getListDispersionAll : 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing/dispersion/{params}',
      // Excluir - incluir en el pago de la dispersion
      excludeSellerPayoneer: 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing/dispersion/excludesellerpayoneerdispersion',
      // ejecutar la dispersion
      sendDispersion : 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing/dispersion',
      // verificar el status de carga de dispersion
      statusLoadDispersion : 'https://iqur5b3ua3.execute-api.us-east-1.amazonaws.com/billing/dispersion/getstatusdispersion'
    },
  },
  // Endpoints production
  prod: {
    v1: {
      // orders
      sendOrderEmail: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/exportoffersbyseller/{idSeller}/{email}',
      searchOrders: 'https://ldixrz8no2.execute-api.us-east-1.amazonaws.com/searchorders-pdn?idSeller={sellerId}&limit={limit}',
      carries: 'https://q8sree00sb.execute-api.us-east-1.amazonaws.com/carrier-pdn',
      sendAllGuides: 'https://vaf1d3c2ic.execute-api.us-east-1.amazonaws.com/sendallguides-pdn',
      downloadOrder: 'https://az3ophrruj.execute-api.us-east-1.amazonaws.com/downloadorder-pdn',
      sendAllProductInOrder: 'https://5zu3684z6e.execute-api.us-east-1.amazonaws.com/sendallproductsinorder-pdn/{orderId}',
      sendProductInOrder: 'https://dc042g38t8.execute-api.us-east-1.amazonaws.com/sendproductinorder-pdn/{orderId}/{idDetailProduct}',
      searchPendingDevolution: 'https://5nkjhkfsm2.execute-api.us-east-1.amazonaws.com/reversionrequest-pdn?{stringParams}',
      pendingDevolution: 'https://5nkjhkfsm2.execute-api.us-east-1.amazonaws.com/reversionrequest-pdn?{stringParams}', // PENDIENTE
      pendingDevolutionSearchTemporal: 'https://5nkjhkfsm2.execute-api.us-east-1.amazonaws.com/reversionrequest-pdn?{stringParams}',
      acceptOrDeniedDevolution: 'https://geddaxinw4.execute-api.us-east-1.amazonaws.com/refuseoracceptdevolution-pdn', // TODO: Faltante en api end points
      recordProcesSedOrder: 'https://cfa1kdi5yj.execute-api.us-east-1.amazonaws.com/recordproccessedorder-pdn',
      getallordersbysellerwithouttracking: 'https://e06ayaf6s9.execute-api.us-east-1.amazonaws.com/getallordersbysellerwithouttracking-pdn{stringParam}',
      validateStatusLoadGuide: 'https://vaf1d3c2ic.execute-api.us-east-1.amazonaws.com/sendallguides-pdn/status',
      // Billing Mock
      getBilling: 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn{stringParams}',
      exportBillingPays: 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn',
      searchBilling: 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn?idSeller={sellerId}&limit={limit}',
      refuseOrAcceptDevolution: 'http://localhost:3000/reversionrequest/requestacceptordenied',
      // Support message
      supporMessage: 'https://7bvbe7k6n8.execute-api.us-east-1.amazonaws.com/createsupport-pdn',
      createcaseseller: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/createcaseseller',
      getreasonsrejection: 'https://m9rdnx8wog.execute-api.us-east-1.amazonaws.com/reasonrejection-pdn{stringParams}',
      // shipments
      getShipmentById: 'service/shipping/{id}',
      listShipments: 'service/shipping/list/state/{state}/from/{from}/to/{take}/order/{sort}/carrier/{carrier}/',
      pickupShipment: 'service/shipping/pickup',
      // servicios para el arbol de categorías
      getAllSellersFull: 'https://0zhu6q42zl.execute-api.us-east-1.amazonaws.com/getallsellers-pdn',
      getAllSellers: 'https://xvc4l3bdd7.execute-api.us-east-1.amazonaws.com/getnameallseller-pdn/1',
      getAllSellersPaginated: 'https://0zhu6q42zl.execute-api.us-east-1.amazonaws.com/getallsellers-pdn/paginated?limit={limit}',
      // servicio empleado para obtener las comisiones de un usuario o todas las comisiones
      getSellerCommissionCategory: 'https://lp04fcggo3.execute-api.us-east-1.amazonaws.com/sellercommissioncategory-pdn/GetAllCategories',
      // Ruta base para la modificación de las categoría
      manageCategory: 'https://lp04fcggo3.execute-api.us-east-1.amazonaws.com/sellercommissioncategory-pdn',
      // Consulta el estado de creación de una categoria
      statusCreateCategory: 'https://lp04fcggo3.execute-api.us-east-1.amazonaws.com/sellercommissioncategory-pdn/GetStatusLoadCommissionCategory',
      // Register seller services
      registerSeller: 'https://x2vflz270c.execute-api.us-east-1.amazonaws.com/registerseller-pdn/',
      validateSellerNit: 'https://ce8fuvj37h.execute-api.us-east-1.amazonaws.com/validatesellernit-pdn/{params}',
      validateSellerEmail: 'https://ejn1rdfov9.execute-api.us-east-1.amazonaws.com/validateselleremail-pdn/{params}',
      validateSellerName: 'https://z0exz5y0f6.execute-api.us-east-1.amazonaws.com/validatesellername-pdn/{params}',
      // Cities and States services
      getCities: 'https://lcdy1iepcf.execute-api.us-east-1.amazonaws.com/cities-pdn/GetCitiesByState/{params}',
      getCitiesCoverage: 'https://lcdy1iepcf.execute-api.us-east-1.amazonaws.com/cities-pdn/GetAllCitiesVtexS3',
      getDaneCodesNonCoverage: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/GetSellerData',
      getStates: 'https://yz3bm0grtf.execute-api.us-east-1.amazonaws.com/states-pdn',
      pacthCitiesNoCoverage: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/UpdateCitiesNonCoverage',
      // Offers
      getOffers: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/{params}',
      patchOffers: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn',
      getOffersAdmin: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/listoffersbyseller/{params}',
      patchOffersProducts: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/registeruniqueoffer',
      getStatusOffers: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/status',
      // Historical
      getHistoricalOffers: 'https://k19m329r85.execute-api.us-east-1.amazonaws.com/offerhistorical-pdn/{params}',
      downloadHistorical: 'https://wq8pypt9ra.execute-api.us-east-1.amazonaws.com/offerdownloadhistorical-pdn/{params}',
      // Historical admin
      getHistoricalOffersAdmin: 'https://0gt6matz9i.execute-api.us-east-1.amazonaws.com/offerhistoricaladmin-pdn/{params}',
      downloadHistoricalAdmin: 'https://cb0d3nxi40.execute-api.us-east-1.amazonaws.com/offerdownloadhistoricaladmin-pdn/{params}',
      // Products
      products: 'https://pnjswhgf60.execute-api.us-east-1.amazonaws.com/products-loads-pdn/{params}',
      // Quoting -->
      getSendMethod: 'https://54k5wykbn7.execute-api.us-east-1.amazonaws.com/shippingmethod-pdn',
      zones: 'https://umn1gjcm9a.execute-api.us-east-1.amazonaws.com/areas-pdn',
      getZone: 'https://umn1gjcm9a.execute-api.us-east-1.amazonaws.com/areas-pdn/{params}',
      transports: 'https://hl7mqciur3.execute-api.us-east-1.amazonaws.com/transporters-pdn',
      getTransport: 'https://hl7mqciur3.execute-api.us-east-1.amazonaws.com/transporters-pdn/{params}',
      getSize: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/getvtexsizelist',
      getQuoting: 'https://ndinovqhh8.execute-api.us-east-1.amazonaws.com/utilities-pdn/shippingcostrules/GetShippingCostRules',
      createQuoting: 'https://ndinovqhh8.execute-api.us-east-1.amazonaws.com/utilities-pdn/shippingcostrules/CreateShippingCostRule',
      updateQuoting: 'https://ndinovqhh8.execute-api.us-east-1.amazonaws.com/utilities-pdn/shippingcostrules/UpdateShippingCostRule',
      deleteQuoting: 'https://ndinovqhh8.execute-api.us-east-1.amazonaws.com/utilities-pdn/shippingcostrules/DeleteShippingCostRule/{param}',
      // Seller
      getListSellersName: 'https://xvc4l3bdd7.execute-api.us-east-1.amazonaws.com/getnameallseller-pdn/{params}',
      getSpecificSeller: 'https://0zhu6q42zl.execute-api.us-east-1.amazonaws.com/getallsellers-pdn/{idSeller}/{allSeller}',
      updateSeller: 'https://yiw0kz0lal.execute-api.us-east-1.amazonaws.com/UpdateSeller-pdn',
      changeStatusSeller: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/SetSellerAvaibality',
      cancelVacationSeller: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/CancelVacation',
      // Validar ean
      getValidateEan: 'https://0ly35c82pa.execute-api.us-east-1.amazonaws.com/products-pdn/',
      // Dashboard
      getSellsSummary: 'https://2l1pous4cl.execute-api.us-east-1.amazonaws.com/OrdersSummaryStatus-pdn/{params}',
      getOrdersStatus: 'https://2l1pous4cl.execute-api.us-east-1.amazonaws.com/OrdersSummaryStatus-pdn/{params}',
      // Estado de Carga
      getStateOfCharge: 'https://pnjswhgf60.execute-api.us-east-1.amazonaws.com/products-loads-pdn/',
      // Guardar logs en CloudWatch
      setCloudWatchLog: 'https://kakj4pzzd9.execute-api.us-east-1.amazonaws.com/prod/logs',
      // Validar formato imagen
      getValidateImage: 'https://nkoltok5rk.execute-api.us-east-1.amazonaws.com/pdn/ValidateImage',
      // Get specs
      getProductSpecs: 'https://fhby1m1mxd.execute-api.us-east-1.amazonaws.com/productsspec-pdn',
      getConfigSpecs: 'https://fhby1m1mxd.execute-api.us-east-1.amazonaws.com/productsspec-pdn',
      // Enviar moderación de productos al correo
      productModeration: 'https://qnhy8aplag.execute-api.us-east-1.amazonaws.com/products-waiting-pdn/{params}',
      // Get Regex
      getRegexBasic: 'https://wpamkgir31.execute-api.us-east-1.amazonaws.com/regex-pdn/{params}',
      // Post Guardar informacion creacion unitaria de producto
      postSaveInformationUnitCreation: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn',
      //
      postUnitSaveInformationUnitCreation: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/unitproduct',
      patchUnitSaveInformationUnitCreation: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/unitproduct',
      // Download billing.
      exportBilling: 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn',
      // Billing orders visualize.
      getBillingOrders: 'https://t4xxi6ge3e.execute-api.us-east-1.amazonaws.com/orders-bill-pdn/{params}',
      // Download Billing .
      postBillingOrders: 'https://t4xxi6ge3e.execute-api.us-east-1.amazonaws.com/orders-bill-pdn/{params}',
      // Actualizar factura
      uploadBilling: 'https://t4xxi6ge3e.execute-api.us-east-1.amazonaws.com/orders-bill-pdn',
      // Obtener contratos por vendedor.
      getTermsBySeller: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/GetContracts/{params}',
      // Actualizar contrato del vendedor
      updateTermsSeller: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/AcceptContract',
      // ACTUALIZAR CON EL DE PRODUCCION
      registersContract: 'https://sw7zmm3j80.execute-api.us-east-1.amazonaws.com/contracts/RegisterContract',
      // Obtener si el vendedor ya acepto los terminos
      getValidationTerms: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/ValidateContract',
      // Obtener los datos del vendedor
      getSellerData: 'https://84urxspbpg.execute-api.us-east-1.amazonaws.com/seller-pdn/GetSellerData',
      // Obtener todos los perfiles.
      getAllProfiles: 'https://tjymvkz23e.execute-api.us-east-1.amazonaws.com/Profiles-pdn/GetAllProfiles',
      // Agregar perfiles.
      createProfile: 'https://tjymvkz23e.execute-api.us-east-1.amazonaws.com/Profiles-pdn/CreateProfile',
      // Editar perfiles.
      updateProfile: 'https://tjymvkz23e.execute-api.us-east-1.amazonaws.com/Profiles-pdn/UpdateProfile',
      // Obtener todos los modulos.
      getAllModule: 'https://tjymvkz23e.execute-api.us-east-1.amazonaws.com/Profiles-pdn/GetAllModules',
      // Obtener todos los permisos.
      getPermissions: 'https://tjymvkz23e.execute-api.us-east-1.amazonaws.com/Profiles-pdn/GetUserPerminsions',
      // Obtener lista de productos
      getProductList: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/{params}',
      // Obtener especificaciones por categoria
      getSpecByCategory: 'https://fhby1m1mxd.execute-api.us-east-1.amazonaws.com/productsspec-pdn/{params}',
      // Obtener lista producto expandido
      getProductExpanded: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/get-product/{params}',
      // Obtener detalles del producto
      getProductDetails: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/unitproduct/{params}',
      // Obtener tipo de perfil
      getTypeProfileAndProfile: 'https://tjymvkz23e.execute-api.us-east-1.amazonaws.com/Profiles-pdn/GetTypeProfileAndProfile',
      // Payoneer
      payoneer: 'https://fi27yra105.execute-api.us-east-1.amazonaws.com/payoneer-pdn/ValidateRegisterPayoneer',
      // Servicio carga masiva moderación productos Seller
      postSaveInformationModerationSeller: 'https://qnhy8aplag.execute-api.us-east-1.amazonaws.com/products-waiting-pdn',
      // PARAMETRIZACION
      // BRANDS GET - Obtener listado de marcas creadas
      // BRANDS GET - Obtener listado de marcas creadas
      getAllBrands: 'https://5rtfag3dpl.execute-api.us-east-1.amazonaws.com/brands-pdn/GetBrands/{params}',
      // BRANDS UPDATE - Actualiza una marca
      updateBrand: 'https://5rtfag3dpl.execute-api.us-east-1.amazonaws.com/brands-pdn/UpdateBrand/{params}',
      // BRANDS CREATE - Crea una nueva marca
      createBrand: 'https://5rtfag3dpl.execute-api.us-east-1.amazonaws.com/brands-pdn/CreateBrand/{params}',
      // BRANDS CREATE - Crea una nueva marca
      validateBrandsExact: 'https://5rtfag3dpl.execute-api.us-east-1.amazonaws.com/brands-pdn/GetExactBrand/{params}',
      // get active brands
      getActiveBrands: 'https://5rtfag3dpl.execute-api.us-east-1.amazonaws.com/brands-pdn/GetBrands/',
      // get categories vetex
      getCategoriesVetex: 'https://fhby1m1mxd.execute-api.us-east-1.amazonaws.com/productsspec-pdn/getspecsbycategoryname/',
      // Support Seller center
      getAllStatusCase: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/get-case-status',
      getAllCase: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/casesfilteredpaged',
      getCase: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/get-case',
      patchCaseResponse: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/respondcasefollow',
      patchReadCase: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/readcase',
      getUnreadCase: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/unreadscount',
      exceptionBrandsManage: '',
      // Reporte de ofertas administrator
      reportsOfferAdmin: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/reportoffersexcel',
      // Get vtex TREET
      getVtexTree: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/getvtextree',
      // Get ordenes Pendientes
      getPendinOrders: 'https://cl9k3h7xr4.execute-api.us-east-1.amazonaws.com/orders-pdn/sellercenter/reversions/amount',
      // Get excecion brand comisiones
      getExceptionBrand: 'https://716x1nqplg.execute-api.us-east-1.amazonaws.com/comsexcep-pdn',
      // Crear/Editar/Elminar comision execpcion marca
      exceptionComissionBrand: 'https://716x1nqplg.execute-api.us-east-1.amazonaws.com/comsexcep-pdn/{params}',
      // Classification of cases
      getCaseCategories: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/get-case-categories',
      // Obtener calificacion de vendedores
      getSellerRating: 'https://cl9k3h7xr4.execute-api.us-east-1.amazonaws.com/orders-pdn/sellercenter/qualificationseller/{params}',
      // Eliminar calificacion de un vendedor
      upsertQualification: 'https://cl9k3h7xr4.execute-api.us-east-1.amazonaws.com/orders-pdn/sellercenter/qualificationseller',
      // consultar las ordenes por tipo de filtros
      ordersSummaryStatus: 'https://2l1pous4cl.execute-api.us-east-1.amazonaws.com/OrdersSummaryStatus-pdn/{params}',
      // Descargar rotulos
      getDownlaodLabel: 'https://cl9k3h7xr4.execute-api.us-east-1.amazonaws.com/orders-pdn/sellercenter/orders/{params}/sticker',
      // Obtener puertos por país
      getPortsByCountryName: 'https://kouotxul6i.execute-api.us-east-1.amazonaws.com/dispatchport-pdn/GetDispatchPortsByCountryName/{params}',
      // Get para consultar todos los estados de las ordenes
      getIdOrders: 'https://cl9k3h7xr4.execute-api.us-east-1.amazonaws.com/orders-pdn/sellercenter/statusorders',
      // Ruta basica para puertos
      managePort: 'https://kouotxul6i.execute-api.us-east-1.amazonaws.com/dispatchport-pdn',
      // Desactivar masiva de Ofertas
      patchDesactiveOffer: 'https://dgu5y5h0u3.execute-api.us-east-1.amazonaws.com/offer-pdn/disableoffersbyseller',
      // Exportar reclamaciones
      exportReclaim: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/downloadreport',
      // GetProducs para modificaciones
      getProductsPendingModify: 'https://qnhy8aplag.execute-api.us-east-1.amazonaws.com/products-waiting-pdn/productsrejected?idSeller={sellerId}&limit={limit}',
      // GetProducts pendiente validacion
      getProductsPendingValidation: ' https://qnhy8aplag.execute-api.us-east-1.amazonaws.com/products-waiting-pdn/productswaiting?idSeller={sellerId}&limit={limit}',
      // GetProducs by EAN para modificaciones
      getEANPendingModify: 'https://qnhy8aplag.execute-api.us-east-1.amazonaws.com/products-waiting-pdn/productsrejected/{params}',
      // GetProducs by EAN para validacion
      getEANPendingValidation: 'https://qnhy8aplag.execute-api.us-east-1.amazonaws.com/products-waiting-pdn/productswaiting/{params}',
      // Exportar productos
      exportProducts: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/report',
      // Listado de resumen de facturacion
      getListAllSummaryBilling: 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn/summary',
      // Detalle de reclaciones
      getDetailTranslationReclaim: 'https://rbanmmpwm0.execute-api.us-east-1.amazonaws.com/cases-pdn/get-case-expanded/{params}',
      // Obtener comentarios de solicitud de devolución
      getAllCommentRefuse: 'https://5nkjhkfsm2.execute-api.us-east-1.amazonaws.com/reversionrequest-pdn/translation',
      // enviar array de archivos para ser procesados y guardados
      setMassiveBillOrderAsync: 'https://t4xxi6ge3e.execute-api.us-east-1.amazonaws.com/orders-bill-pdn/setmassivebillorderasync',
      // consultar status de carga masiva de facturas
      getstatussetmassivebilling: 'https://t4xxi6ge3e.execute-api.us-east-1.amazonaws.com/orders-bill-pdn/getstatussetmassivebilling',
      // enviar por correo un reporte con los errores en vtex
      reportErrorsVtex: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/reportfailsendvtex/{params}',
      // archivo en s3 formato carga masiva de excepcion
      uploadMasiveUpload: 'https://seller-center-exito-staging.s3.amazonaws.com/Templates/FormatChargeCommissions.xlsx',
      // verificar el estado de la carga masiva para excepciones PLU
      verificateStatusException: 'https://716x1nqplg.execute-api.us-east-1.amazonaws.com/comsexcep-pdn/GetMassiveComsnExcStatus',
      // enviar data en formato json al back
      sendDataJsonReadExcel: 'https://716x1nqplg.execute-api.us-east-1.amazonaws.com/comsexcep-pdn/MassiveComsnExc',
      // Listado de colores
      getListColor: 'https://pb78swws90.execute-api.us-east-1.amazonaws.com/products-pdn/colors',
      // Descargable del listado/historico de cancelaciones
      exportListCancel: 'https://5nkjhkfsm2.execute-api.us-east-1.amazonaws.com/reversionrequest-pdn/report',
      // Descargar arbol de categorías
      exporCategories: 'https://lp04fcggo3.execute-api.us-east-1.amazonaws.com/sellercommissioncategory-pdn/GenerateReportCategories',
      // Eliminar categpria por Id
      deleteCategory: 'https://lp04fcggo3.execute-api.us-east-1.amazonaws.com/sellercommissioncategory-pdn/DeleteCategory{params}',
      // Descargar exportar comisiones
      exportCommission: 'https://716x1nqplg.execute-api.us-east-1.amazonaws.com/comsexcep-pdn/ExportComsnExcsAudit/{params}',
      // Obtener el listado de comisiones ultimos 15 dias
      getListCommissionAll: 'https://716x1nqplg.execute-api.us-east-1.amazonaws.com/comsexcep-pdn/GetComsnExcsAudit/{params}',
      // Obtener listado de historico de pagos
      getListHistoricPayments: 'https://paaw2oxdqd.execute-api.us-east-1.amazonaws.com/pdn/detaildispersion{params}',
      // Obtener listado novedades cobro
      getListNewsCollected: 'https://paaw2oxdqd.execute-api.us-east-1.amazonaws.com/pdn/detailpaymentnews{params}',
      // Obtener el listado de vendedores para hacer la dispersion
      getListDispersionAll : 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn/dispersion/{params}',
      // Excluir - incluir en el pago de la dispersion
      excludeSellerPayoneer: 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn/dispersion/excludesellerpayoneerdispersion',
      // ejecutar la dispersion
      sendDispersion : 'https://rtox6c92tc.execute-api.us-east-1.amazonaws.com/financial-pdn/dispersion',
       // verificar el status de carga de dispersion
      statusLoadDispersion : ''
    }
  }
};
