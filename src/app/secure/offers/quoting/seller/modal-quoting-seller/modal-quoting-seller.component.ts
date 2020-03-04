import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ShippingMethodsService } from '../../administrator/shipping-methods/shipping-methods.service';
import { ShippingMethodsModel } from '../../administrator/shipping-methods/shipping-methods.model';
import { Logger, LoadingService, ModalService, UserParametersService } from '@app/core';
import { ListTransporterService } from '../../administrator/list-transporter/list-transporter.service';
import { TransportModel } from '../../administrator/dialogs/models/transport.model';
import { ListZonesService } from '../../administrator/list-zones/list-zones.service';
import { ZoneModel } from '../../administrator/dialogs/models/zone.model';
import { QuotingService } from '../../quoting.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SupportService } from '@app/secure/support-modal/support.service';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from '@app/secure/products/create-product-unit/categorization/search.component.service';

const log = new Logger('ModalQuotingSellerComponent');

export enum quotiongDialogAction {
  add,
  update,
  delete,
  idZone
}

@Component({
  selector: 'app-modal-quoting-seller',
  templateUrl: './modal-quoting-seller.component.html',
  styleUrls: ['./modal-quoting-seller.component.scss']
})

export class ModalQuotingSellerComponent implements OnInit {

  action: any;
  actions = quotiongDialogAction;
  public transportTypeList: Array<ShippingMethodsModel>;
  public listTransporters: Array<TransportModel> = [];
  public listZones: ZoneModel[];
  // Esta es la variable que maneja todo.
  stepOne = 0;
  stepTwo = 1;
  public stepper = [{
    show: true, // Muestra de primero
    validForm: false
  },
  {
    show: false,
    validForm: false
  }];
  principalForm: FormGroup;
  secondForm: FormGroup;
  indexForm = [1];
  showFinalValue = true;
  // precio = 2, categoria = 1, peso =3 cuales son los ids de esos
  placeholders = [
    {
      initialValue: this.languageService.instant('secure.offers.quoting.seller.cod_category'),
      shippingValue: this.languageService.instant('secure.offers.quoting.seller.freight_cost')
    }, {
      initialValue: this.languageService.instant('secure.offers.quoting.seller.initialPrice'),
      finalValue: this.languageService.instant('secure.offers.quoting.seller.finalPrice'),
      shippingValue: this.languageService.instant('secure.offers.quoting.seller.freight_cost')
    }, {
      initialValue: this.languageService.instant('secure.offers.quoting.seller.initialWeight'),
      finalValue: this.languageService.instant('secure.offers.quoting.seller.finalWeight'),
      shippingValue: this.languageService.instant('secure.offers.quoting.seller.freight_cost')
    }
  ];
  shippingMethod: number;

  quotingRegex = {
    priceInfinite: '',
    formatNumberInfinito: ''
  };
  subTitle: string;
  public user: any;
  sellerId: string;

  dataToSend = {
    'IdSeller': null,
    'IdZone': null,
    'Zone': null,
    'ZoneDaneCode': null,
    'IdMethodShipping': null,
    'MethodShipping': null,
    'IdTransport': null,
    'Transport': null,
    'Ranges': null
  };

  element;
  listCategories: any;
  title: string;

  constructor(
    private methodService: ShippingMethodsService,
    private service: ListZonesService,
    private transportService: ListTransporterService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private quotingService: QuotingService,
    public SUPPORT: SupportService,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
    private searchService: SearchService,
    public userParams: UserParametersService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ModalQuotingSellerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.action = data ? data.action : null;
    this.element = data ? data.element : null;
    this.getDataUser();
  }

  ngOnInit() {
    console.log('data: ', this.data);
    this.getTransportMethodRequiredData(); // Get methods.
    this.createPrincipalForm();
    this.validateFormSupport();
    this.getCategoriesList();
  }


  /**
   * Metodo para obtener datos del usuario.
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  /**
   * Metodo para crear el primer formulario
   * @memberof ModalQuotingSellerComponent
   */
  public createPrincipalForm() {
    this.principalForm = new FormGroup({
      MethodShipping: new FormControl(this.element ? this.element.IdMethodShipping : null, [Validators.required]),
      Transport: new FormControl(this.element ? this.element.IdTransport : null, [Validators.required]),
      Zone: new FormControl(this.element ? this.element.IdZone : null, [Validators.required]),
    });
    if (this.element) {
      this.next(this.stepOne, this.principalForm);
      this.allowSecondForm();
    }
  }

  /**
   * Metodo para mostrar segundo formulario al momoento de la accion editar y setearle los valores.
   * @memberof ModalQuotingSellerComponent
   */
  public allowSecondForm() {
    this.element.Ranges.forEach((range, index) => {
      this.secondForm.controls[`initialValue${index}`].setValue(range.Initial);
      if (range.Final) {
        this.secondForm.controls[`finalValue${index}`].setValue(range.Final);
      }
      this.secondForm.controls[`shippingValue${index}`].setValue(range.Value);
      if (this.element.Ranges.length > index + 1) {
        this.addFormControl();
      }
    });
  }

  /**
   * Metodo para crear segundo formulario
   * @param {*} valuePrinpcipalForm
   * @memberof ModalQuotingSellerComponent
   */
  public createSecondForm(valuePrinpcipalForm: any) {
    this.shippingMethod = valuePrinpcipalForm.MethodShipping;
    this.showFinalValue = valuePrinpcipalForm.MethodShipping !== 1; // id categoria: si cambia toca cambiar esto.
    this.secondForm = new FormGroup({
      initialValue0: new FormControl('', [Validators.required]),
      shippingValue0: new FormControl('', [Validators.required]),
    });
    if (this.showFinalValue) {
      this.indexForm[0] = valuePrinpcipalForm.MethodShipping;
      this.secondForm.addControl(
        'finalValue0', new FormControl('Infinito', [Validators.required]),
      );
    }
    this.validatorsIputs(valuePrinpcipalForm.MethodShipping);
    this.setIdandNameMethod(valuePrinpcipalForm.MethodShipping);
    this.setIdandNameTransport(valuePrinpcipalForm.Transport);
    this.setIdandNameZone(valuePrinpcipalForm.Zone);
  }

  /**
   * Función para validar que el precio inicial no sea mayor a 8mil
   * @memberof ModalQuotingSellerComponent
   */
  public validatePrice() {
    const index = this.indexForm.length - 1; // Indice de los inputs.
    const initialPrice = this.secondForm.controls[`initialValue${index}`].value;

    const absControl = `initialValue${index}`;

    if (this.shippingMethod === 2) {
      if (+initialPrice && +initialPrice <= 8000) {
        this.secondForm.controls[absControl].setErrors({ 'price_must_less': true });
      } else {
        this.secondForm.controls[`initialValue${index}`].setErrors(null);
      }
    }
  }

  /**
   * Función para validar que el precio final no sea mayor a 8mil
   * @memberof ModalQuotingSellerComponent
   */
  public validatePriceFinal() {
    const index = this.indexForm.length - 1; // Indice de los inputs.
    const finalPrice = this.secondForm.controls[`finalValue${index}`].value;

    const absControl = `initialValue${index}`;

    if (this.shippingMethod === 2) {
      if (+finalPrice && +finalPrice <= 8000) {
        this.secondForm.controls[absControl].setErrors({ 'price_must_less_final': true });
      } else {
        this.secondForm.controls[`finalValue${index}`].setErrors(null);
      }
    }
  }

  /**
   * Metodo apra validar que la categoria exista.
   * @param {*} index
   * @memberof ModalQuotingSellerComponent
   */
  public validateCategorie(index: any) {
    const word = this.secondForm.controls[`initialValue${index}`].value;

    const absControl = `initialValue${index}`;
    const exitCategorie = this.listCategories.find(el => el.Id === +word);

    if (this.shippingMethod === 1) {
      if (exitCategorie) {
        this.secondForm.controls[absControl].setErrors(null);
      } else {
        this.secondForm.controls[absControl].setErrors({ 'invalid_category': true });
      }
    }
  }

  /**
   * Metodo que se encarga de setear validaciones segun metodo de envío
   * @param {*} param
   * @returns
   * @memberof ModalQuotingSellerComponent
   */
  public validatorsIputs(param: any) {
    const index = this.indexForm.length - 1; // Indice de los inputs.
    let validators: any;

    switch (param) {
      case 1:
        validators = [
          this.secondForm.controls[`initialValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.priceInfinite)]),
          this.secondForm.controls[`shippingValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.priceInfinite)])
        ];
        this.title = 'Rango por categoria';
        break;
      case 2:
        this.secondForm.controls[`initialValue${0}`].setValue(8000);
        validators = [
          this.secondForm.controls[`initialValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.priceInfinite)]),
          this.secondForm.controls[`finalValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.priceInfinite)]),
          this.secondForm.controls[`shippingValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumberInfinito)])
        ];
        this.title = 'Rango por precio';
        this.subTitle = '(Valor en pesos)';
        break;
      case 3:
        validators = [
          this.secondForm.controls[`initialValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumberInfinito)]),
          this.secondForm.controls[`finalValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumberInfinito)]),
          this.secondForm.controls[`shippingValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.priceInfinite)])
        ];
        this.title = 'Rango por peso';
        this.subTitle = '(Peso en KG)';
        break;
    }
    return validators;
  }

  /**
   * Metodo para consultar datos de la regex de la base de datos y setearla a los validadores de los controles del formulario
   * @memberof ModalQuotingSellerComponent
   */
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'ofertas');
      for (const val in this.quotingRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.quotingRegex[val] = element && `${element.Value}`;
        }
      }
    });
  }

  /**
   * Metodo para ir añadiendo los controles de cada rango de parametrizacíon
   * @memberof ModalQuotingSellerComponent
   */
  public addFormControl() {
    if (this.secondForm.valid) {
      this.secondForm.disable();
      this.secondForm.addControl(`initialValue${this.indexForm.length}`, new FormControl('', [Validators.required]));
      this.secondForm.addControl(`shippingValue${this.indexForm.length}`, new FormControl('', [Validators.required]));
      if (this.showFinalValue) {
        this.secondForm.addControl(
          `finalValue${this.indexForm.length}`, new FormControl('Infinito', [Validators.required]),
        );
      }
      this.indexForm.push(this.shippingMethod);
      this.validatorsIputs(this.principalForm.value.MethodShipping);
    }
  }

  /**
   * Metodo para ir eliminando parametrizaciones segun el index.
   * @param {number} index
   * @memberof ModalQuotingSellerComponent
   */
  public removeItem(index: number) {
    this.indexForm.splice(index, 1);
    this.secondForm.removeControl(`initialValue${index}`);
    this.secondForm.removeControl(`shippingValue${index}`);
    if (this.showFinalValue) {
      this.secondForm.removeControl(`finalValue${index}`);
    }

    this.secondForm.controls[`initialValue${this.indexForm.length - 1}`].enable();
    this.secondForm.controls[`shippingValue${this.indexForm.length - 1}`].enable();
    if (this.showFinalValue) {
      this.secondForm.controls[`finalValue${this.indexForm.length - 1}`].enable();
    }

  }

  /**
   * Metodo para validar en que vista pararse de los formularios
   * @param {*} step
   * @param {*} form
   * @memberof ModalQuotingSellerComponent
   */
  public next(step: any, form: any) {
    if (form.valid) {
      this.stepper[step].show = false;
      if (step === this.stepOne) {
        this.createSecondForm(this.principalForm.value);
        this.stepper[this.stepTwo].show = true;
      }
    }
  }
  /**
   * Function to get required data to charge select in transport form.
   * @memberof ModalQuotingSellerComponent
   */
  public getTransportMethodRequiredData(): void {
    this.loadingService.viewSpinner();
    this.methodService.getShippingMethods().subscribe((res: any) => {
      this.getListTransporters(); // Get transport
      if (res.statusCode === 200) {
        if (res.body) {
          const body = JSON.parse(res.body);
          this.transportTypeList = body.Data;
        }
      } else {
        log.error('Error al intentar obtener los metodos de envios');
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Funcion que obtiena las transportadoras
   * @memberof ModalQuotingSellerComponent
   */
  public getListTransporters() {
    this.loadingService.viewSpinner();
    this.transportService.getListTransporters().subscribe((result: any) => {
      this.getListZones(); // Get zones.
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listTransporters = body.Data;
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Funcion que obtiene las zonas
   * @memberof ModalQuotingSellerComponent
   */
  public getListZones(): void {
    this.loadingService.viewSpinner();
    this.service.getListZones().subscribe((result: any) => {
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listZones = body.Data;
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Funcion para eliminar parametrizaciones por IdZone
   * @memberof ModalQuotingSellerComponent
   */
  public deleteIdQuote(): void {
    this.loadingService.viewSpinner();
    this.quotingService.deleteQuotingSeller(this.data.idZone)
      .subscribe((result: any) => {
        if (result.status === 201 || result.status === 200) {
          if (result.body.statusCode === 200 || result.body.statusCode === 201) {
            if (result.body) {
              const data = JSON.parse(result.body.body);
              if (data.Data === true) {
                this.loadingService.closeSpinner();
                this.dialogRef.close(confirm);
              }
            }
          }
        } else {
          this.modalService.showModal('error');
          this.loadingService.closeSpinner();
        }
        this.loadingService.closeSpinner();
      });
  }

  /**
   * Metodo que se encarga de adjunatr el nombre y el id del metodo del envío
   * @param {*} id
   * @memberof ModalQuotingSellerComponent
   */
  public setIdandNameMethod(id: any) {
    if (this.transportTypeList && this.transportTypeList.length) {
      this.transportTypeList.forEach(el => {
        if (el.Id === id) {
          this.dataToSend.MethodShipping = el.Name;
          this.dataToSend.IdMethodShipping = el.Id;
        }
      });
    }
  }

  /**
   * Metodo que se encarga de adjunatr el nombre y el id de la transportadora
   * @param {*} id
   * @memberof ModalQuotingSellerComponent
   */
  public setIdandNameTransport(id: any) {
    if (this.listTransporters && this.listTransporters.length) {
      this.listTransporters.forEach(el => {
        if (el.Id === id) {
          this.dataToSend.Transport = el.Name;
          this.dataToSend.IdTransport = el.Id;
        }
      });
    }
  }

  /**
   * Metodo que se encarga de adjuntar el nombre, el id y la zona al omento de seleccionar la Zona
   * @param {*} id
   * @memberof ModalQuotingSellerComponent
   */
  public setIdandNameZone(id: any) {
    if (this.listZones && this.listZones.length) {
      this.listZones.forEach(el => {
        if (el.Id === id) {
          this.dataToSend.Zone = el.Name;
          this.dataToSend.IdZone = el.Id;
          this.dataToSend.ZoneDaneCode = el.DaneCode;
        }
      });
    }
  }

  /**
   * Funcion para ir concatenando los rangos inscritos
   * @returns
   * @memberof ModalQuotingSellerComponent
   */
  public validRanges() {
    const data = [];
    if (this.shippingMethod === 1) {
      this.indexForm.forEach((element, index) => {
        data.push({
          Initial: this.secondForm.controls[`initialValue${index}`].value,
          Final: '',
          Value: this.secondForm.controls[`shippingValue${index}`].value
        });
      });
    } else {
      this.indexForm.forEach((element, index) => {
        data.push({
          Initial: this.secondForm.controls[`initialValue${index}`].value,
          Final: this.secondForm.controls[`finalValue${index}`].value,
          Value: this.secondForm.controls[`shippingValue${index}`].value
        });
      });
    }
    return data;
  }

  public validDataToSend() {
    return this.validRanges();
  }

  /**
   * Metodo paara guardar parametrizacion de cotizador
   * @memberof ModalQuotingSellerComponent
   */
  public saveQuoting() {
    this.loadingService.viewSpinner();
    this.dataToSend.IdSeller = localStorage.getItem('userId');
    if (this.sellerId === undefined || this.sellerId === '' || this.sellerId === null || !this.sellerId) {
      this.dataToSend.IdSeller = this.user.sellerId;
    }
    if (this.data.action === 1) {
      this.dataToSend = this.data.element;
    }
    this.dataToSend.Ranges = this.validDataToSend();
    this.quotingService.crateQuotingSeller(this.dataToSend).subscribe((res: any) => {
      if (res.status === 201 || res.status === 200) {
        if (res.body.statusCode === 200 || res.body.statusCode === 201) {
          if (res.body.body) {
            const data = JSON.parse(res.body.body);
            if (data.Data === true) {
              this.dialogRef.close(confirm);
              this.snackBar.open(this.languageService.instant('secure.offers.quoting.seller.save_info_ok'), this.languageService.instant('actions.close'), {
                duration: 5000,
              });
            } else {
              this.snackBar.open(this.languageService.instant('secure.offers.quoting.seller.save_info_ko'), this.languageService.instant('actions.close'), {
                duration: 5000,
              });
            }
          }
        } else {
          this.modalService.showModal('errorService');
        }
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Funcion para obtener listado de categorias.
   * @memberof ModalQuotingSellerComponent
   */
  public getCategoriesList(): void {
    this.searchService.getCategories().subscribe((result: any) => {
      // guardo el response
      if (result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listCategories = body.Data;
        console.log('this.listCategories: ', this.listCategories);
      }
    });
  }

  public compareValue() {
    const index = this.indexForm.length - 1; // Indice de los inputs.
    const absControl = `initialValue${index}`;

    if (this.indexForm.length > 1) {
      if (this.shippingMethod === 2) {
        if (Number(this.secondForm.controls[`initialValue${this.indexForm.length - 1}`].value) < Number(this.secondForm.controls[`finalValue${this.indexForm.length - 2}`].value)) {
          console.log('SI ES MAYOR');
          this.secondForm.controls[absControl].setErrors({ 'price_must_less_priceFinal': true });
        } else {
          this.secondForm.controls[absControl].setErrors(null);
        }
      }
      if (this.shippingMethod === 3) {
        if (Number(this.secondForm.controls[`initialValue${this.indexForm.length - 1}`].value) < Number(this.secondForm.controls[`finalValue${this.indexForm.length - 2}`].value)) {
          console.log('SI ES MAYOR');
          this.secondForm.controls[absControl].setErrors({ 'weigth_must_less_priceFinal': true });
        } else {
          this.secondForm.controls[absControl].setErrors(null);
        }
      }
    }

  }
}
