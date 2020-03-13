import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { MatSidenav, MatSnackBar, MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { PortCollectionService } from './port-collection.service';
import { LoadingService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalPortComponent } from './modal-port/modal-port.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { countries } from '../../../secure/seller/register/countries';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ResponseCaseDialogComponent } from '@app/shared/components/response-case-dialog/response-case-dialog.component';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit {

  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;

  public stateSideNavOrder = false;
  public dataSource: MatTableDataSource<any>;
  public dialogRef: MatDialogRef<ResponseCaseDialogComponent>;
  @ViewChild('dialogContent') content: TemplateRef<any>;


  public formPort: FormGroup;
  public filterPort: FormGroup;
  keywords = [];
  countries = countries;
  filterCountry = [];
  validateKey = true;
  countryCurrent: string;
  body: any;
  idPort: any;
  refresh = false;
  data: any;
  lastState: 0;
  isClear= false;
  listFilterBrands = [];
  separatorKeysCodes = [];

  length: number;

  public displayedColumns = [
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

  constructor(
    private portCollectionService: PortCollectionService,
    private loadingService: LoadingService,
    private languageService: TranslateService,
    public dialog: MatDialog,
    public snackBar?: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getAllCenterCollection();
    this.createFormControls();
  }
/**
 * funcion para consultar el listado de los puertos guardados
 *
 * @memberof PortComponent
 */
getAllCenterCollection() {
    this.loadingService.viewSpinner();
    this.portCollectionService.getAllPort(null).subscribe((res: any) => {
      this.loadingService.closeSpinner();
      if (res) {
        this.length = res.length;
        this.dataSource = new MatTableDataSource(res);
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
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
      country: new FormControl(''),
      applyCountry: new FormControl(''),
      address: new FormControl('', Validators.compose([Validators.required])),
      phone: new FormControl('', Validators.compose([Validators.required])),
      insurance_freight: new FormControl('', Validators.compose([Validators.required])),
      preparation: new FormControl('', Validators.compose([Validators.required])),
      shippingCost: new FormControl('', Validators.compose([Validators.required])),
      national_transportation: new FormControl('', Validators.compose([Validators.required])),
      insurance_CIF: new FormControl('', Validators.compose([Validators.required])),
      tariffByKg: new FormControl('', Validators.compose([Validators.required])),
      tariff: new FormControl('', Validators.compose([Validators.required])),
      iva: new FormControl('', Validators.compose([Validators.required])),
    });

    this.filterPort = new FormGroup({
      countryFilter: new FormControl('', Validators.compose([Validators.required]))
    });

    this.formPort.get('applyCountry').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterCountry = this.countries.filter(country => country.CountryName.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterCountry.find(country => country.CountryName === val);
        if (!exist) {
          this.formPort.get('applyCountry').setErrors({ pattern: false });
        } else {
          this.formPort.get('applyCountry').setErrors(null);
        }
      } else if (!val) {
        this.filterCountry = [];
        this.formPort.get('applyCountry').setErrors(null);
      } else {
        this.formPort.get('applyCountry').setErrors(null);
      }

    });
    this.formPort.get('country').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterCountry = this.countries.filter(country => country.CountryName.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterCountry.find(country => country.CountryName === val || country.CountryName === this.countryCurrent);
        if (!exist) {
          this.formPort.get('country').setErrors({ pattern: false });
        } else {
          this.formPort.get('country').setErrors(null);
        }
      } else if (!val) {
        this.filterCountry = [];
        this.formPort.get('country').setErrors(null);
      } else {
        this.formPort.get('country').setErrors(null);
      }

    });
    this.filterPort.get('countryFilter').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterCountry = this.countries.filter(country => country.CountryName.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterCountry.find(country => country.CountryName === val);
        if (!exist) {
          this.filterPort.get('countryFilter').setErrors({ pattern: false });
        } else {
          this.filterPort.get('countryFilter').setErrors(null);
        }
      } else if (!val) {
        this.filterCountry = [];
        this.filterPort.get('countryFilter').setErrors(null);
      } else {
        this.filterPort.get('countryFilter').setErrors(null);
      }

    });
  }
/**
 * funcion para salvar los paises en chips y almacenarlos en una variable global para su utilidad
 *
 * @memberof PortComponent
 */
public saveKeyword(): void {
    let word = this.formPort.controls.applyCountry.value;
    if (word) {
      word = word.trim();
      if (this.keywords.length < 20) {
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
        this.formPort.controls.applyCountry.clearValidators();
        this.formPort.controls.applyCountry.reset();
        this.validateKey = this.keywords.length > 0 ? false : true;
      } else {
        this.snackBar.open(this.languageService.instant('secure.products.create_product_unit.basic_information.only_up_to_20_keywords'), 'Cerrar', {
          duration: 3000,
        });
      }
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
      this.formPort.controls['country'].setValue(this.data.data.country);
      this.formPort.controls['address'].setValue(this.data.data.address);
      this.formPort.controls['phone'].setValue(this.data.data.phone);
      this.formPort.controls['insurance_freight'].setValue(this.data.data.insurance_freight);
      this.formPort.controls['preparation'].setValue(this.data.data.preparation);
      this.formPort.controls['shippingCost'].setValue(this.data.data.shippingCost);
      this.formPort.controls['national_transportation'].setValue(this.data.data.national_transportation);
      this.formPort.controls['insurance_CIF'].setValue(this.data.data.insurance_CIF);
      this.formPort.controls['tariffByKg'].setValue(this.data.data.tariffByKg);
      this.formPort.controls['tariff'].setValue(this.data.data.tariff);
      this.formPort.controls['iva'].setValue(this.data.data.iva);
      if (this.data && this.data.data && this.data.data.countrys.length > 0) {
        this.data.data.countrys.forEach(element => {
          this.keywords.push(element);
        });
        this.validateKey = this.keywords.length > 0 ? false : true;
        this.countryCurrent = this.data.data.country;
        this.idPort = this.data.data.id;
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
      this.body = this.formPort.value;
      const params = {
        id: this.idPort,
        country: this.body.country,
        address: this.body.address,
        phone: this.body.phone,
        tariff: this.body.tariff,
        shippingCost: this.body.shippingCost,
        insurance: this.body.insurance_freight,
        preparation: this.body.preparation,
        nationalTransport: this.body.national_transportation,
        insuranceCIF: this.body.insurance_CIF,
        tariffByKg: this.body.tariffByKg,
        iva: this.body.iva,
        applyCountry: this.keywords
      };
      this.portCollectionService.savePort(params).subscribe(result => {
        if (result && result === true) {
          this.getAllCenterCollection();
          this.onNoClick();
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
    console.log(params);
  }
/**
 * funcion para limpiar el formulario del filtro
 *
 * @memberof PortComponent
 */
clearFormFilter() {
    this.filterPort.reset();
  }


  changeSizeOrderTable(event: any) {}
  paginations(event: any) {}
  getOrdersList(event: any) {}
}
