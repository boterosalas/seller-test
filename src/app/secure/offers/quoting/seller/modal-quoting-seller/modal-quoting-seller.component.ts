import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
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
      initialValue: 'Codigo de categoria',
      shippingValue: 'Valor cobro flete'
    }, {
      initialValue: 'Precio Inicial',
      finalValue: 'Precio Final',
      shippingValue: 'Valor cobro flete'
    }, {
      initialValue: 'Peso Inicial',
      finalValue: 'Peso Final',
      shippingValue: 'Valor cobro flete'
    }
  ];
  shippingMethod: number;

  quotingRegex = {
    price: '',
    formatNumber: ''
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
  constructor(
    private methodService: ShippingMethodsService,
    private service: ListZonesService,
    private transportService: ListTransporterService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private quotingService: QuotingService,
    public SUPPORT: SupportService,
    public userParams: UserParametersService,
    public dialogRef: MatDialogRef<ModalQuotingSellerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data, this.actions);
    this.action = data ? data.action : null;
    this.element = data ? data.element : null;
    this.getDataUser();
  }

  ngOnInit() {
    this.getTransportMethodRequiredData(); // Get methods.
    this.createPrincipalForm();
    this.validateFormSupport();
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
      console.log(this.secondForm, range, index, this.secondForm.controls[`initialValue${index}`],
        `initialValue${index}`);
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
    console.log(valuePrinpcipalForm);
    this.shippingMethod = valuePrinpcipalForm.MethodShipping;
    console.log(11, valuePrinpcipalForm.MethodShipping);
    this.showFinalValue = valuePrinpcipalForm.MethodShipping !== 1; // id categoria: si cambia toca cambiar esto.
    this.secondForm = new FormGroup({
      initialValue0: new FormControl('', [Validators.required]),
      shippingValue0: new FormControl('', [Validators.required]),
    });
    if (this.showFinalValue) {
      this.indexForm[0] = valuePrinpcipalForm.MethodShipping;
      this.secondForm.addControl(
        'finalValue0', new FormControl('', [Validators.required]),
      );
    }
    this.validatorsIputs(valuePrinpcipalForm.MethodShipping);
    this.setIdandNameMethod(valuePrinpcipalForm.MethodShipping);
    this.setIdandNameTransport(valuePrinpcipalForm.Transport);
    this.setIdandNameZone(valuePrinpcipalForm.Zone);
    console.log('this.dataToSend: ', this.dataToSend);
  }

  /**
   * Metodo que se encarga de setear validaciones segun metodo de envío
   * @param {*} param
   * @returns
   * @memberof ModalQuotingSellerComponent
   */
  public validatorsIputs(param: any) {
    console.log(param);
    const index = this.indexForm.length - 1; // Indice de los inputs.
    let validators: any;
    switch (param) {
      case 1:
        console.log('1: ', 1);
        validators = [
          this.secondForm.controls[`initialValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)]),
          this.secondForm.controls[`shippingValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)])
        ];
        this.subTitle = 'Rango por categoria';
        break;
      case 2:
        console.log('2: ', 2);
        validators = [
          this.secondForm.controls[`initialValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)]),
          this.secondForm.controls[`finalValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)]),
          this.secondForm.controls[`shippingValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumber)])
        ];
        this.subTitle = 'Rango por precio';
        break;
      case 3:
        console.log('3: ', 3);
        console.log(this.secondForm.controls[`initialValue${index}`].value);
        validators = [
          this.secondForm.controls[`initialValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumber)]),
          this.secondForm.controls[`finalValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumber)]),
          this.secondForm.controls[`shippingValue${index}`].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)])
        ];
        this.subTitle = 'Rango por peso';

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
    this.secondForm.addControl(`initialValue${this.indexForm.length}`, new FormControl('', [Validators.required]));
    this.secondForm.addControl(`shippingValue${this.indexForm.length}`, new FormControl('', [Validators.required]));
    if (this.showFinalValue) {
      this.secondForm.addControl(
        `finalValue${this.indexForm.length}`, new FormControl('', [Validators.required]),
      );
    }
    this.indexForm.push(this.shippingMethod);
    this.validatorsIputs(this.principalForm.value.MethodShipping);
  }

  public removeItem(index: number) {
    console.log('rico ese *', this.secondForm);
    this.indexForm.splice(index, 1);
    this.secondForm.removeControl(`initialValue${index}`);
    this.secondForm.removeControl(`shippingValue${index}`);
    if (this.showFinalValue) {
      this.secondForm.removeControl(`finalValue${index}`);
    }
  }

  /**
   * Metodo para validar en que vista pararse de los formularios
   * @param {*} step
   * @param {*} form
   * @memberof ModalQuotingSellerComponent
   */
  public next(step: any, form: any) {
    console.log(step, form);
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
    this.methodService.getShippingMethods().subscribe((res: any) => {
      console.log('res: ', res);
      this.getListTransporters(); // Get transport
      if (res.statusCode === 200) {
        if (res.body) {
          const body = JSON.parse(res.body);
          this.transportTypeList = body.Data;
          console.log(this.transportTypeList);
        }
      } else {
        log.error('Error al intentar obtener los metodos de envios');
      }
    });
  }

  /**
   * Funcion que obtiena las transportadoras
   * @memberof ModalQuotingSellerComponent
   */
  public getListTransporters() {
    this.transportService.getListTransporters().subscribe((result: any) => {
      this.getListZones(); // Get zones.
      if (result.status === 201 || result.status === 200) {
        const body = JSON.parse(result.body.body);
        this.listTransporters = body.Data;
        console.log(this.listTransporters);
        /** Validate if needs to show spinner, because doesnt finished required services */
      } else {
        this.modalService.showModal('errorService');
      }
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
        console.log(this.listZones);
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
    this.indexForm.forEach((element, index) => {
      data.push({
        Initial: this.secondForm.value[`initialValue${index}`],
        Final: this.secondForm.value[`finalValue${index}`],
        Value: this.secondForm.value[`shippingValue${index}`]
      });
    });
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
    this.dataToSend.Ranges = this.validDataToSend();
    console.log('this.dataToSend: ', this.dataToSend);
    this.quotingService.crateQuotingSeller(this.dataToSend).subscribe((res: any) => {
      console.log(res);
      if (res.status === 201 || res.status === 200) {
        if (res.body.statusCode === 200 || res.body.statusCode === 201) {
          if (res.body.body) {
            const data = JSON.parse(res.body.body);
            console.log(data);
            if (data.Data === true) {
              this.dialogRef.close(confirm);
            }
          }
        }
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }
}
