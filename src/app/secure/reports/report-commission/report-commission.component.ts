import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-report-commission',
  templateUrl: './report-commission.component.html',
  styleUrls: ['./report-commission.component.scss']
})
export class ReportCommissionComponent implements OnInit {

   // Configuración para el toolbar-options y el search de la pagina
   public informationToForm: SearchFormEntity = {
    title: 'Reportes',
    subtitle: 'menu.Reporte de comisiones',
    btn_title: 'Reportes',
    title_for_search: 'Filtros reporte',
    type_form: 'report',
    information: new InformationToForm,
    count: null
  };

  isClear= false;
  lastState: 0;
  length = 0;

  public filterDateInit: any;
  public filterDateEnd: any;
  public user: any;

  public btnDownload = true;
  public btnFilter = true;
  public stateSideNavOrder = false;
  public textForSearch: FormControl;
  public filteredOptions: Observable<string[]>;
  public listSellers: any;
  

  public filterCommission: FormGroup;

  @ViewChild('sidenavSearchCommission') sidenavSearchCommission: MatSidenav;

  public displayedColumns = [
    'PLU',
    'Brand',
    'Category',
    'EAN',
    'IdSeller',
    'DateInitial',
    'DateEnd',
    'Commission',
    'Admin',

  ];


  constructor(
    public eventsSeller: EventEmitterSeller,
    public storeService: StoresService,
  ) {
    this.textForSearch = new FormControl();
    this.listSellers = [];
    this.user = {};
   }

  ngOnInit() {
    this.createFormControls();
    this.getAllSellers();
    this.filteredOptions = this.textForSearch.valueChanges
    .pipe(
      startWith(''),
      map((val: any) =>
        this.filter(val)
      )
    );
  }

  toggleFilterReportCommission() {
    this.sidenavSearchCommission.toggle();
  }

  createFormControls() {
    this.filterCommission = new FormGroup({
      IdSeller: new FormControl('', [Validators.pattern(null)]),
      DateInit: new FormControl('', [Validators.pattern(null)]),
      DateEnd: new FormControl('', [Validators.pattern(null)]),
      plu: new FormControl('', [Validators.pattern(null)]),
      brand: new FormControl('', [Validators.pattern(null)]),
    });

  }
  public filter(val: string): string[] {
    if (val !== null && this.listSellers) {
      return this.listSellers.filter(option =>
        option.Name && option.Name.toLowerCase().includes(val.toLowerCase()));
    }
  }

  public viewStoreInformation(search_seller: StoreModel) {
    // llamo el eventEmitter que se emplea para notificar cuando una tienda ha sido consultada
    this.eventsSeller.searchSeller(search_seller);
  }

  public whatchValueInput(event: any): void {
    if (event === '') {
      this.textForSearch.reset();
    }
  }

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

  public getAllSellers() {
      this.storeService.getAllStoresFull(this.user).subscribe((res: any) => {
        if (res.status === 200) {
          if (res && res.body && res.body.body) {
            const body = JSON.parse(res.body.body);
            this.listSellers = body.Data;
            if (this.listSellers.length > 0) {
              this.listSellers = this.listSellers.filter(x => x.Profile !== 'seller');
            }
            console.log(this.listSellers);
          }
        } else {
          this.listSellers = res.message;
        }
      });
  }



  changeSizeOrderTable(event: any) { }
  paginations(event: any) { }
  getOrdersList(event: any) { }

}
