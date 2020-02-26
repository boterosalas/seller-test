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
    'Ranges': []
  };

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
    this.getDataUser();
  }

  ngOnInit() {
    this.getTransportMethodRequiredData(); // Get methods.
    this.getListTransporters(); // Get transport
    this.getListZones(); // Get zones.
    this.createPrincipalForm();
    this.validateFormSupport();
  }


  /**
   * Metodo para obtener datos del usuario.
   */
  async getDataUser() {
    this.user = await this.userParams.getUserData();
  }

  public createPrincipalForm() {
    this.principalForm = new FormGroup({
      MethodShipping: new FormControl('', [Validators.required]),
      Transport: new FormControl('', [Validators.required]),
      Zone: new FormControl('', [Validators.required]),
    });
  }

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

  public validatorsIputs(param: any) {
    console.log(param);
    let validators: any;
    switch (param) {
      case 1:
        console.log('1: ', 1);
        validators = [
          this.secondForm.controls['initialValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)]),
          this.secondForm.controls['shippingValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)])
        ];
        this.subTitle = 'Rango por categoria';
        break;
      case 2:
        console.log('2: ', 2);
        validators = [
          this.secondForm.controls['initialValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)]),
          this.secondForm.controls['finalValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)]),
          this.secondForm.controls['shippingValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumber)])
        ];
        this.subTitle = 'Rango por precio';
        break;
      case 3:
        console.log('3: ', 3);
        console.log(this.secondForm.controls['initialValue0'].value);
        validators = [
          this.secondForm.controls['initialValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumber)]),
          this.secondForm.controls['finalValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.formatNumber)]),
          this.secondForm.controls['shippingValue0'].setValidators([Validators.required, Validators.pattern(this.quotingRegex.price)])
        ];
        this.subTitle = 'Rango por peso';

        break;
    }
    return validators;
  }

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

  public addFormControl() {
    this.secondForm.addControl(`initialValue${this.indexForm.length}`, new FormControl('', [Validators.required]));
    this.secondForm.addControl(`shippingValue${this.indexForm.length}`, new FormControl('', [Validators.required]));
    if (this.showFinalValue) {
      this.secondForm.addControl(
        `finalValue${this.indexForm.length}`, new FormControl('', [Validators.required]),
      );
    }
    this.indexForm.push(this.shippingMethod);
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

  public setIdandNameMethod(id: any) {
    this.transportTypeList.forEach( el => {
      if (el.Id === id) {
        this.dataToSend.MethodShipping = el.Name;
        this.dataToSend.IdMethodShipping = el.Id;
      }
    });
  }

  public setIdandNameTransport(id: any) {
    this.listTransporters.forEach( el => {
      if (el.Id === id) {
        this.dataToSend.Transport = el.Name;
        this.dataToSend.IdTransport = el.Id;
      }
    });
  }

  public setIdandNameZone(id: any) {
    this.listZones.forEach( el => {
      if (el.Id === id) {
        this.dataToSend.Zone = el.Name;
        this.dataToSend.IdZone = el.Id;
        this.dataToSend.ZoneDaneCode = el.DaneCode;
      }
    });
  }

  public saveQuoting() {
    console.log('form1: ', this.principalForm);
    console.log('fprm2: ', this.secondForm);
    const data = this.secondForm.value;
    this.sellerId = localStorage.getItem('userId');
    if (this.sellerId === undefined || this.sellerId === '' || this.sellerId === null || !this.sellerId) {
      this.sellerId = this.user.sellerId;
    }
    // const data2 = {
    //   'IdSeller': this.sellerId,
    //   'IdZone': 3,
    //   'ZoneDaneCode': '18001000',
    //   'IdMethodShipping': 1,
    //   'IdTransport': 22,
    //   'Ranges': [
    //     {
    //       'Initial': '27221',
    //       'Final': '',
    //       'Value': 8000
    //     },
    //     {
    //       'Initial': '272211',
    //       'Final': '',
    //       'Value': 9000
    //     },
    //     {
    //       'Initial': '27703',
    //       'Final': '',
    //       'Value': 20000
    //     }
    //   ]
    // };
    // this.loadingService.viewSpinner();
    // this.quotingService.crateQuotingSeller(data).subscribe((res: any) => {
    //   console.log('res: ', res);
    // });
  }
}
