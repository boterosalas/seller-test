import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { InformationToForm, SearchFormEntity } from '@app/shared';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

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

  public filterProduts: FormGroup;
  isClear = false;
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
  keywords: Array<any> = [];
  invalidAdmin: Boolean = false;
  validateKey = true;
  idAdmin: any;
  nameAdmin: Array<any> = [];
  listCommission2: any;
  listCommission: any;
  invalidCommission: Boolean = false;

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
    private fb?: FormBuilder,
  ) {
    this.textForSearch = new FormControl();
    this.listSellers = [];
    this.user = {};
  }

  ngOnInit() {
    this.createFormControls();

  }

  toggleFilterReportCommission() {
    this.sidenavSearchCommission.toggle();
  }

  createFormControls() {
    this.filterCommission = this.fb.group({
      IdSeller: new FormControl('', [Validators.pattern(null)]),
      DateInit: new FormControl('', [Validators.pattern(null)]),
      DateEnd: new FormControl('', [Validators.pattern(null)]),
      plu: new FormControl('', [Validators.pattern(null)]),
      brand: new FormControl('', [Validators.pattern(null)]),
      commission: new FormControl(''),
    });
    this.filterCommission.get('commission').valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.listCommission2 = this.listCommission.filter(commission => commission.Name.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.listCommission2.find(commission => commission.Name === val);
        if (!exist) {
          this.filterCommission.get('commission').setErrors({ pattern: true });
          this.invalidCommission = true;
        } else {
          this.filterCommission.get('commission').setErrors(null);
          this.invalidCommission = false;
        }
      } else if (!val) {
        this.listCommission2 = [];
        this.filterCommission.get('commission').setErrors(null);
      } else {
        this.filterCommission.get('commission').setErrors(null);
      }
    });
    this.getCategoriesList();
  }

  getCategoriesList() {
    this.storeService.getAllStoresFull(this.user).subscribe((res: any) => {
      if (res.status === 200) {
        if (res && res.body && res.body.body) {
          const body = JSON.parse(res.body.body);
          this.listCommission = body.Data;
          if (this.listCommission.length > 0) {
            this.listCommission = this.listCommission.filter(x => x.Profile !== 'seller');
          }
        }
      } else {
        this.listCommission = res.message;
      }
    });
  }

  public saveKeyword(): void {
    let word = this.filterCommission.controls.commission.value;
    if (word) {
      word = word.trim();
      if (word.search(',') === -1) {
        if (this.invalidCommission === false) {
          this.keywords.push(word);
        }
      } else {
        const counter = word.split(',');
        counter.forEach(element => {
          if (element) {
            this.keywords.push(element);
          }
        });
      }
      this.filterCommission.controls.commission.clearValidators();
      this.filterCommission.controls.commission.reset();
      this.validateKey = this.keywords.length > 0 ? false : true;
    }
  }

  apllyFilterCommission(form: any) {
    console.log(form);
    console.log(this.keywords);
  }

  clearForm() {
    this.keywords = [];
    this.filterCommission.reset();
  }

}
