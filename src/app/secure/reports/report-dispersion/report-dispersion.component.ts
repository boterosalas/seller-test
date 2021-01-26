import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { ReportDispersionService } from './report-dispersion.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-report-dispersion',
  templateUrl: './report-dispersion.component.html',
  styleUrls: ['./report-dispersion.component.scss']
})
export class ReportDispersionComponent implements OnInit {

  public btnFilter = false;
  public btnDownload = false;
  public informationToForm: SearchFormEntity = {
    title: 'Reportes',
    subtitle: 'menu.Reporte cobros pendientes MPI',
    btn_title: 'Reportes',
    title_for_search: 'Filtros reporte',
    type_form: 'report',
    information: new InformationToForm,
    count: null
  };
  public showContainerDetail = true;
  public filteredOptions: Observable<string[]>;
  public listSellers: any;
  public textForSearch: FormControl;
  public user: any;
  public sellerCurrent = {};
  public btnAddSeller = true;
  public form: FormGroup;
  sellerList = [];
  arraySellerId = [];
  valueCheck = false;
  email: string;


  constructor(
    public eventsSeller: EventEmitterSeller,
    public storeService: StoresService,
    private profileService: MyProfileService,
    public reportDispersionService: ReportDispersionService,
    public snackBar?: MatSnackBar,
  ) {
    this.listSellers = [];
    this.user = {};
    this.textForSearch = new FormControl();
  }

  ngOnInit() {
    this.createForm();
    this.getAllSellers();
    this.getAllDataUser();
    this.filteredOptions = this.textForSearch.valueChanges
      .pipe(
        startWith(''),
        map((val: any) =>
          this.filter(val)
        )
      );
  }

  /**
  * Evento que permite capturar cuando un usuario presiona enter al estar en el input,
  * Este evento se agrega para poder obtener el primer resultado que se encuentre en la lista al momento de presionar enter
  * @param {any} event
  * @memberof SearchStoreComponent
  */
  public keyDownFunction(event: any): void {
    // keyCode 13 -> Enter
    if (event.keyCode === 13) {
      // Obtengo los ultimos registros almacenados sobre la lista de busqueda
      const suscribe = this.filteredOptions.subscribe((res: any) => {
        // busco dentro de los registro el que conincida con el cricterio de busqueda actual
        const found = res.find((x: StoreModel) => x.Name === this.textForSearch.value);
        // si hay algun resultado de busqueda, paso a visualizar la información de la tienda
        if (found !== undefined) {
          this.viewStoreInformation(found);
        }
      });
      suscribe.unsubscribe();
    }
  }

  /**
 * Método que retorna el resultado dentro del array de tiendas disponible
 * @param {string} val
 * @returns {string[]}
 * @memberof SearchStoreComponent
 */
  public filter(val: string): string[] {
    if (val !== null && this.listSellers) {
      return this.listSellers.filter(option =>
        option.Name && option.Name.toLowerCase().includes(val.toLowerCase()));
    }
  }

  /**
  * 
  * 
  * @param {any} search_seller
  * @memberof SearchStoreComponent
  */
  public viewStoreInformation(seller: StoreModel) {
    if (seller) {
      this.sellerCurrent = seller;
      this.btnAddSeller = false;
      this.form.controls['importAll'].reset();
      this.form.controls['importAll'].setValue(false);
      this.valueCheck = false;
    }
  }

  public saveSeller(seller) {
    console.log(seller);
    this.sellerList.push(seller.Name);
    this.arraySellerId.push(seller.IdSeller);
    this.btnAddSeller = true;
    this.textForSearch.reset();
  }

  createForm() {
    this.form = new FormGroup({
      importAll: new FormControl(this.valueCheck),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  clearSellerSearch(value: any) {
    this.valueCheck = !value;
    if (this.valueCheck === true) {
      this.textForSearch.reset();
      this.sellerList = [];
      this.arraySellerId = [];
    }
  }

  /**
  * Evento que permite escuchar los cambios en el input de busqueda para saber si no hay un valor ingresado y setear el campo
  * @param {any} event
  * @memberof SearchStoreComponent
  */
  public whatchValueInput(event: any): void {
    if (event === '') {
      this.textForSearch.reset();
    }
    if (event === null) {
      this.btnAddSeller = true;
    }
  }

  /**
  * Método empleado para consultar la lista de tiendas disponibles
  * @memberof SearchStoreComponent
  */
  public getAllSellers() {
    this.storeService.getAllStores(this.user).subscribe((res: any) => {
      if (res.status === 200) {
        if (res && res.body && res.body.body) {
          const body = JSON.parse(res.body.body);
          this.listSellers = body.Data;
        }
      } else {
        this.listSellers = res.message;
      }
    });
  }


  async getAllDataUser() {
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      this.email = userData.Email;
      this.form.controls['email'].setValue(this.email);
    });
  }

  dowloadReportDisperion() {
    const params = {
      listSeller: this.arraySellerId,
      email: this.form.controls['email'].value
    }
    this.reportDispersionService.sendReportDispersion(params).subscribe((res: any) => {
      if (res) {
        const msg = 'Se ha realizado la descarga del reporte de comisiones correctamente, revisa tu correo electrónico en unos minutos.';
        this.snackBar.open(msg, 'Cerrar', {
          duration: 3000
        });
        this.clearSellerSearch(false);

      } else {
        const msg = 'Se ha presentado un error al realizar la descarga del reporte de comisiones';
        this.snackBar.open(msg, 'Cerrar', {
          duration: 3000
        });
      }


    });
  }
}
