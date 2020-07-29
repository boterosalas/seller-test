import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { MatSidenav, MatSnackBar, MatTableDataSource, MatDialog, MatDialogRef, ErrorStateMatcher } from '@angular/material';
import { PortCollectionService } from './port-collection.service';
import { LoadingService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalPortComponent } from './modal-port/modal-port.component';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { countries } from '../../../secure/seller/register/countries';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ResponseCaseDialogComponent } from '@app/shared/components/response-case-dialog/response-case-dialog.component';
import { SupportService } from '@app/secure/support-modal/support.service';
import { trigger, transition, animate, style, state } from '@angular/animations';

/**
 * exporta funcion para mostrar los errores de validacion del formulario
 *
 * @export
 * @class MyErrorStateMatcher
 * @implements {ErrorStateMatcher}
 */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PortComponent implements OnInit {

  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;

  public stateSideNavOrder = false;
  public dataSource: MatTableDataSource<any>;
  public initialPortList: any;
  public dialogRef: MatDialogRef<ResponseCaseDialogComponent>;
  @ViewChild('dialogContent') content: TemplateRef<any>;


  public formPort: FormGroup;
  public filterPort: FormGroup;
  keywords = [];
  countries = countries;
  filterCountryFilter = [];
  filterCountryName = [];
  filterCountryApply = [];
  filterCountryAddress = [];
  validateKey = true;
  countryCurrent: string;
  body: any;
  idPort: any;
  refresh = false;
  data: any;
  lastState: 0;
  isClear = false;
  listFilterBrands = [];
  separatorKeysCodes = [];
  filter = null;
  mapInitialPortList: any;
  PortRegex = { formatTwoDecimal: '', formatFiveDecimal: '', formatIntegerNumber: '' };
  method = '';
  show = false;

  length = 0;

  public displayedColumns = [
    'expand',
    'name',
    'collection_center',
    'address',
    'phone',
    'action'
  ];


  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'module.Parametrización',
    subtitle: 'menu.Parametrizar Centros de Acopio',
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'orders',
    information: new InformationToForm,
    count: null
  };

  isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  constructor(
    private portCollectionService: PortCollectionService,
    private loadingService: LoadingService,
    private languageService: TranslateService,
    public SUPPORT: SupportService,
    public dialog: MatDialog,
    public snackBar?: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getAllCenterCollection();
    this.createFormControls();
    this.getRegexByModule();
  }


  public getRegexByModule(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'parametrizacion');
      for (const val in this.PortRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.PortRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }
  /**
   * funcion para consultar el listado de los puertos guardados
   *
   * @memberof PortComponent
   */
  getAllCenterCollection(params?: any) {
    this.loadingService.viewSpinner();
    if (params && params.countryFilter) {
      this.filter = params.countryFilter;
    }
    this.portCollectionService.getAllPort(this.filter).subscribe((res: any) => {
      this.loadingService.closeSpinner();
      if (!!res && !!res.status && res.status === 200) {
        if (res && res.body && res.body.body) {
          this.initialPortList = JSON.parse(res.body.body).Data;
          if (JSON.stringify(this.initialPortList) !== '{}') {
            this.mapInitialPortList = this.mapItems(this.initialPortList);
            this.dataSource = new MatTableDataSource(this.mapInitialPortList);
            this.length = this.initialPortList.length;
          } else {
            this.length = 0;
            this.dataSource = new MatTableDataSource(null);
          }
        }
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    });
  }

  /**
   * funcion para mapear el resultado del servicio get all brands
   * @param {any[]} items
   * @returns {any[]}
   * @memberof BrandsComponent
   */
  mapItems(items: any[]): any[] {
    return items.map(x => {
      return {
        Id: x.Id,
        Name: x.Name,
        Address: x.Address,
        City: x.City,
        CountryIso2: x.CountryIso2,
        CountryName: x.CountryName,
        PostalCode: x.PostalCode,
        Province: x.Province,
        Phone: x.Phone,
        Tariff: x.Tariff,
        ShippingCost: x.ShippingCost,
        NegotiatedShippingCost: x.NegotiatedShippingCost,
        InsuranceFreight: x.InsuranceFreight,
        Preparation: x.Preparation,
        NationalTransport: x.NationalTransport,
        InsuranceCif: x.InsuranceCif,
        CountryString: x.Country && x.Country.length > 0 ? x.Country.join(', ') : null,
        Country: x.Country,
      };
    });
  }

  /**
   * funcion para abrir el componente del filtro
   *
   * @memberof PortComponent
   */
  toggleFilterPorts() {
    this.sidenavSearchOrder.toggle();
  }
  /**
   * funcion para abri el modal tanto como para editar como para crear
   *
   * @param {number} typeModal
   * @param {*} data
   * @memberof PortComponent
   */
  upsetPort(typeModal: number, data: any) {
    this.setDataDialog(typeModal, data);
  }
  /**
   * funcion para abrir el dialogo y pasar variables que recibe el modal
   *
   * @param {number} typeModal
   * @param {*} data
   * @memberof PortComponent
   */
  public setDataDialog(typeModal: number, data: any): void {
    this.data = { typeModal: typeModal, data: data };
    this.setEdit();
    const dialogRef = this.dialog.open(ModalPortComponent, {
      width: '55%',
      minWidth: '280px',
      data: data
    });
    setTimeout(() => {
      this.configDataDialog(dialogRef);
    });
  }
  /**
   * funcion para capturar el evento del modal confirmar
   *
   * @param {MatDialogRef<ModalPortComponent>} dialog
   * @memberof PortComponent
   */
  configDataDialog(dialog: MatDialogRef<ModalPortComponent>) {
    const dialogInstance = dialog.componentInstance;
    dialogInstance.content = this.content;
  }
  /**
   * funcion para crear el formulario, controles y las validaciones correspondientes
   *
   * @memberof PortComponent
   */
  createFormControls() {
    this.formPort = new FormGroup({
      name: new FormControl('', Validators.compose([Validators.required])),
      country: new FormControl(''),
      address: new FormControl('', Validators.compose([Validators.required])),
      nameCountry: new FormControl('', Validators.compose([Validators.required])),
      city: new FormControl('', Validators.compose([Validators.required])),
      countryIso2: new FormControl('', Validators.compose([Validators.required])),
      postalCode: new FormControl('', Validators.compose([Validators.required])),
      province: new FormControl('', Validators.compose([Validators.required])),
      phone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatIntegerNumber)])),
      insuranceFreight: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatFiveDecimal)])),
      preparation: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatTwoDecimal)])),
      shippingCost: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatTwoDecimal)])),
      nationalTransport: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatTwoDecimal)])),
      insuranceCif: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatFiveDecimal)])),
      negotiatedShippingCost: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatFiveDecimal)])),
      tariff: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.PortRegex.formatFiveDecimal)])),
    });

    this.filterPort = new FormGroup({
      countryFilter: new FormControl('', Validators.compose([Validators.required]))
    });

    this.formPort.get('country').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterCountryApply = this.countries.filter(country => country.CountryName.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterCountryApply.find(country => country.CountryName === val);
        if (!exist) {
          this.formPort.get('country').setErrors({ pattern: false });
        } else {
          this.formPort.get('country').setErrors(null);
        }
      } else if (!val) {
        this.filterCountryApply = [];
        this.formPort.get('country').setErrors(null);
      } else {
        this.formPort.get('country').setErrors(null);
      }
    });
    this.filterPort.get('countryFilter').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterCountryFilter = this.countries.filter(country => country.CountryName.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterCountryFilter.find(country => country.CountryName === val);
        if (!exist) {
          this.filterPort.get('countryFilter').setErrors({ pattern: false });
        } else {
          this.filterPort.get('countryFilter').setErrors(null);
        }
      } else if (!val) {
        this.filterCountryFilter = [];
        this.filterPort.get('countryFilter').setErrors(null);
      } else {
        this.filterPort.get('countryFilter').setErrors(null);
      }
    });
    this.formPort.get('nameCountry').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterCountryAddress = this.countries.filter(country => country.CountryName.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterCountryAddress.find(country => country.CountryName === val);
        if (!exist) {
          this.formPort.get('nameCountry').setErrors({ pattern: false });
        } else {
          this.formPort.get('nameCountry').setErrors(null);
        }
      } else if (!val) {
        this.filterCountryAddress = [];
        this.formPort.get('nameCountry').setErrors(null);
      } else {
        this.formPort.get('nameCountry').setErrors(null);
      }
    });
  }
  /**
   * funcion para salvar los paises en chips y almacenarlos en una variable global para su utilidad
   *
   * @memberof PortComponent
   */
  public saveKeyword(): void {
    let word = this.formPort.controls.country.value;
    if (word) {
      word = word.trim();
        if (word.search(',') === -1) {
          this.keywords.push(word);
        } else {
          const counter = word.split(',');
          counter.forEach(element => {
            if (element) {
              this.keywords.push(element);
            }
          });
        }
        this.formPort.controls.country.clearValidators();
        this.formPort.controls.country.reset();
        this.validateKey = this.keywords.length > 0 ? false : true;
    }
  }
  /**
   * funcion para eliminar el listado (chip's) de los paises agregados
   *
   * @param {number} indexOfValue
   * @memberof PortComponent
   */
  public deleteKeywork(indexOfValue: number): void {
    this.keywords.splice(indexOfValue, 1);
    this.validateKey = this.keywords.length > 0 ? false : true;
    if (this.keywords.length < 1) {
      this.formPort.setErrors({ required: true });
    }
  }
  /**
   * funcion para setear los valores en el modal de puertos
   *
   * @memberof PortComponent
   */
  setEdit() {
    if (this.data && this.data.data !== null && this.data.typeModal === 2) {
      this.resetFormModal();
      this.formPort.controls['name'].setValue(this.data.data.Name);
      this.formPort.controls['city'].setValue(this.data.data.City);
      this.formPort.controls['countryIso2'].setValue(this.data.data.CountryIso2);
      this.formPort.controls['postalCode'].setValue(this.data.data.PostalCode);
      this.formPort.controls['province'].setValue(this.data.data.Province);
      this.formPort.controls['address'].setValue(this.data.data.Address);
      this.formPort.controls['nameCountry'].setValue(this.data.data.CountryName);
      this.formPort.controls['phone'].setValue(this.data.data.Phone);
      this.formPort.controls['insuranceFreight'].setValue(this.data.data.InsuranceFreight);
      this.formPort.controls['preparation'].setValue(this.data.data.Preparation);
      this.formPort.controls['shippingCost'].setValue(this.data.data.ShippingCost);
      this.formPort.controls['nationalTransport'].setValue(this.data.data.NationalTransport);
      this.formPort.controls['insuranceCif'].setValue(this.data.data.InsuranceCif);
      this.formPort.controls['negotiatedShippingCost'].setValue(this.data.data.NegotiatedShippingCost);
      this.formPort.controls['tariff'].setValue(this.data.data.Tariff);
      if (this.data && this.data.data && this.data.data.Country.length > 0) {
        this.data.data.Country.forEach(element => {
          this.keywords.push(element);
        });
        this.validateKey = this.keywords.length > 0 ? false : true;
        this.countryCurrent = this.data.data.Country;
        this.idPort = this.data.data.Id;
      }
    } else {
      this.resetFormModal();
    }
  }
  /**
   * funcion para resetear (limpiar) el formulario cada vez que se abra
   *
   * @memberof PortComponent
   */
  resetFormModal() {
    this.formPort.reset();
    this.validateKey = true;
    this.countryCurrent = null;
    this.idPort = undefined;
    this.keywords = [];
  }
  /**
   * funcion para salvar las modificaciones o adicionar un puerto
   *
   * @memberof PortComponent
   */
  public savePort() {
    if (this.formPort && this.formPort.controls) {
      this.loadingService.viewSpinner();
      this.body = this.formPort.value;
      const params = {
        id: this.idPort,
        name: this.body.name,
        address: this.body.address,
        countryName: this.body.nameCountry,
        city: this.body.city,
        countryIso2: this.body.countryIso2,
        postalCode: this.body.postalCode,
        province: this.body.province,
        phone: this.body.phone,
        tariff: this.body.tariff,
        shippingCost: this.body.shippingCost.toString(),
        insuranceFreight: this.body.insuranceFreight.toString(),
        preparation: this.body.preparation.toString(),
        nationalTransport: this.body.nationalTransport.toString(),
        insuranceCif: this.body.insuranceCif.toString(),
        negotiatedShippingCost: this.body.negotiatedShippingCost.toString(),
        country: this.keywords
      };
      if (this.idPort) {
        this.method = 'upsertPort';
        this.portCollectionService[this.method](params).subscribe(res => {
          if (!!res && !!res.status && res.status === 200) {
            if (res && res.body && res.body.body) {
              const error = JSON.parse(res.body.body).Errors;
              if (error && Array.isArray(error) && error.length > 0) {
                this.loadingService.closeSpinner();
                this.snackBar.open(this.languageService.instant(error), this.languageService.instant('actions.close'), {
                  duration: 3000,
                });
              } else {
                this.getAllCenterCollection();
                this.loadingService.closeSpinner();
                this.onNoClick();
              }
            }
          }
        }, error => {
          this.loadingService.closeSpinner();
          this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
            duration: 3000,
          });
        });
      } else {
        this.method = 'savePort';
        this.portCollectionService[this.method](params).subscribe(res => {
          if (!!res && !!res.statusCode && res.statusCode === 200) {
            if (res && res.body) {
              const error = JSON.parse(res.body).Errors;
              if (error && Array.isArray(error) && error.length > 0) {
                this.loadingService.closeSpinner();
                this.snackBar.open(this.languageService.instant(error), this.languageService.instant('actions.close'), {
                  duration: 3000,
                });
              } else {
                this.onNoClick();
                this.loadingService.closeSpinner();
                this.getAllCenterCollection();
              }
            }
          }
        }, error => {
          this.loadingService.closeSpinner();
          this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
            duration: 3000,
          });
        });
      }
    }
  }
  /**
   * funcion para cerrar el modal, tanto en el boton como en el icono en la parte superior derecho
   *
   * @memberof PortComponent
   */
  onNoClick() {
    this.dialog.closeAll();
  }
  /**
   * funcion para capturar parametros y realizar el filtrado de los paises y mostrar los puertos asociados
   *
   * @param {*} params
   * @memberof PortComponent
   */
  getFilterPort(params: any) {
    if (params && params.countryFilter) {
      this.portCollectionService.filterPortByCountryName(params.countryFilter).subscribe(res => {
        if (res && res.body && res.body.body) {
          this.initialPortList = JSON.parse(res.body.body).Data;
          if (JSON.stringify(this.initialPortList) !== '{}') {
            this.mapInitialPortList = this.mapItems(this.initialPortList);
            this.dataSource = new MatTableDataSource(this.mapInitialPortList);
            this.length = this.initialPortList.length;
          } else {
            this.length = 0;
          }
          this.toggleFilterPorts();
        }
      }, error => {
        this.loadingService.closeSpinner();
        this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
          duration: 3000,
        });
      });
    }
  }
  /**
   * funcion para limpiar el formulario del filtro
   *
   * @memberof PortComponent
   */
  clearFormFilter() {
    this.getAllCenterCollection();
    this.toggleFilterPorts();
    this.filterPort.clearValidators();
    this.filterPort.reset();
  }

  validar(e: any) {
    const tecla = e.keyCode;
    if (tecla === 13) {
      this.saveKeyword();
    }
  }


  changeSizeOrderTable(event: any) { }
  paginations(event: any) { }
  getOrdersList(event: any) { }
}
