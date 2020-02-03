import { Component, OnInit, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { ShellComponent } from '@app/core/shell';
import { LoadingService } from '@app/core';
import { MatTableDataSource, MatSidenav, ErrorStateMatcher } from '@angular/material';
import { animate, style, transition, state, trigger } from '@angular/animations';
import { CalificationService } from '../quality.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import * as moment from 'moment';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-calification-list',
  templateUrl: './calification-list.component.html',
  styleUrls: ['./calification-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class CalificationListComponent implements OnInit {

  numberElements = 0;
  public informationToForm: SearchFormEntity = {
    title: 'module.Calidad',
    subtitle: 'menu.Calificación de Vendedores',
    btn_title: 'secure.quality.quality-score.filter-title',
    title_for_search: 'secure.quality.quality-score.filter-title',
    type_form: 'orders',
    information: new InformationToForm,
    count: this.numberElements.toString()
  };
  typeProfile = 1;
  public idSeller: any;
  public nameSeller: string;
  public subFilterOrder: any;
  public displayedColumns = [
    'qualityScore',
    'qualityMonth',
    'qualityIssued',
    'actions'
  ];

  public monthEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    public monthES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public dateInitQualityMonth = '';
  public dateFinalQualityMonth = '';
  public dateInitQualityIssued = '';
  public dateFinalQualityIssued = '';

  public paginationToken = '{}';
  public arrayPosition = [];
  public params: any;
  public isClear = false;

  public pageSize = 50;
  public querySearch = '';
  public onlyOne = true;
  public dataSource: MatTableDataSource<any>;
  public length = 0;
  public showEmpty = true ;

  public stateSideNavOrder = false;

  private searchSubscription: any;

  public showContainerDetail = false;
  public detailByElemet: any;

  public calificationsParams: any;
  public sortedData: any;

  public penaltyOutSideDelivery = 0;
  public penaltyCanceledBySeller = 0;
  public penaltyTotal = 0;

  public colorCalificationPromiseDelivery = 'default';
  public colorCalificationCase = 'default';
  public colorCalificationCanceled = 'default';

  public setFormatDateInfoSellerMonthQuality = '';
  public setFormatDateInfoSellerGenrateDate = '';

  detail =  [
    {
          'OrdersOutsideDeliveryDate': {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'DeliveryDate': 'dd/mm/yyyy',
          'DelayDays': 3,
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 10000,
          'TotalCommission': 1456423
        },
      ​
        'OrdersCanceledBySellerResponsibility':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'OrderStatus': 'Entregado',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 20000,
          'TotalCommission': 1456423
        },
        'OrdersWithPqr':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
        }
  },
    {
          'OrdersOutsideDeliveryDate': {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'DeliveryDate': 'dd/mm/yyyy',
          'DelayDays': 3,
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 30000,
          'TotalCommission': 1456423
        },
      ​
        'OrdersCanceledBySellerResponsibility':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'OrderStatus': 'Entregado',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 40000,
          'TotalCommission': 1456423
        },
        'OrdersWithPqr':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
        }
  },
    {
          'OrdersOutsideDeliveryDate': {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'DeliveryDate': 'dd/mm/yyyy',
          'DelayDays': 3,
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 60000,
          'TotalCommission': 1456423
        },
      ​
        'OrdersCanceledBySellerResponsibility':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'OrderStatus': 'Entregado',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 70000,
          'TotalCommission': 1456423
        },
        'OrdersWithPqr':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
        }
  },
    {
          'OrdersOutsideDeliveryDate': {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'DeliveryDate': 'dd/mm/yyyy',
          'DelayDays': 3,
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 90000,
          'TotalCommission': 1456423
        },
      ​
        'OrdersCanceledBySellerResponsibility':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'OrderStatus': 'Entregado',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
          'Penalty': 10000,
          'TotalCommission': 1456423
        },
        'OrdersWithPqr':
        {
          'OrderNumber': '12345',
          'OrderDate': 'dd/mm/yyyy',
          'MaxDeliveryDate': 'dd/mm/yyyy',
          'ReasonPqr': '',
          'PqrDate': 'dd/mm/yyyy',
          'CustomerIdentificationCard': '123454687',
          'CustomerName': 'Aristóbulo XD',
        }
  }
];


  // public myGroup: FormGroup;

  // BrandsRegex = { dateMonthYear: ''};
  // public matcher: MyErrorStateMatcher;

  public filterCalifications: FormGroup;
  public matcher: MyErrorStateMatcher;
  BrandsRegex = { dateMonthYear: '' };

  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;

  constructor(
    private shellComponent: ShellComponent,
    private loadingService: LoadingService,
    private calificationService: CalificationService,
    public eventsSeller: EventEmitterSeller,
    private fb: FormBuilder,
    public SUPPORT?: SupportService,
  ) {
  }

  ngOnInit() {
    this.eventEmitSearch();
    this.createFormControls();
    this.validateFormSupport();
  }

  createFormControls() {
    this.filterCalifications = new FormGroup({
      dateInitQualityMonth: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateFinalQualityMonth: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateInitQualityIssued: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
      dateFinalQualityIssued: new FormControl('', [Validators.pattern(this.BrandsRegex.dateMonthYear)]),
    });
  }

  // Funcion para cargar datos de regex
  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'dashboard');
      for (const val in this.BrandsRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.BrandsRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }

  eventEmitSearch() {
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      this.idSeller = seller.IdSeller;
      this.nameSeller = seller.Name;
      this.onlyOne = true;
      const paramsArray = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI('{}'),
        'idSeller': this.idSeller,
        'callOne': true,
      };
      this.getCalificationsBySeller(paramsArray);
    });
  }

  paginations(event: any) {
    if (event) {
      const index = event.param.pageIndex;
      if (event.param.pageSize !== this.pageSize) {
        this.setItemsByPage(event.param.pageSize);
        this.validateArrayPositionPaginationToken();
      } else {
        this.querySearch = '';
      }
      if (index === 0) {
        this.paginationToken = '{}';
      }
      const isExistInitial = this.arrayPosition.includes('{}');
      if (isExistInitial === false) {
        this.arrayPosition.push('{}');
      }
      const isExist = this.arrayPosition.includes(this.paginationToken);
      if (isExist === false) {
        this.arrayPosition.push(this.paginationToken);
      }

      this.paginationToken = this.arrayPosition[index];
      if (this.paginationToken === undefined) {
        this.paginationToken = '{}';
        this.isClear = true;
      }
      const params = {
        'limit': this.pageSize + '&paginationToken=' + encodeURI(this.paginationToken),
        'idSeller': this.idSeller,
        'dateInitQualityMonth': this.dateInitQualityMonth,
        'dateFinalQualityMonth': this.dateFinalQualityMonth,
        'dateInitQualityIssued': this.dateInitQualityIssued,
        'dateFinalQualityIssued': this.dateFinalQualityIssued,
      };
      this.getCalificationsBySeller(params);
    }
  }

  setItemsByPage(size: any) {
    this.pageSize = size;
  }

  validateArrayPositionPaginationToken() {
    if (this.arrayPosition && this.arrayPosition.length > 0) {
      this.arrayPosition = [];
      this.isClear = true;
    }
  }

  getCalificationsBySeller(params?: any) {
    this.loadingService.viewSpinner();
    this.params = this.setParameters(params);
    console.log(this.params);
    this.calificationService.getListCalificationsBySeller(this.params).subscribe((res: any) => {
      this.setTable(res);
      this.loadingService.closeSpinner();
    });
  }
  setParameters(params: any) {
    if (params && params.callOne) {
      this.paginationToken = '{}';
      this.arrayPosition = [];
    }
    if (params && params.clear) {
      this.dateInitQualityMonth = '';
      this.dateFinalQualityMonth = '';

      this.dateInitQualityIssued = '';
      this.dateFinalQualityIssued = '';
    }
    let calificationsParams = '';
    if (this.idSeller) {
      calificationsParams = this.idSeller + '/';
    }
    if (this.dateInitQualityMonth) {
      calificationsParams += this.dateInitQualityMonth + '/';
    } else {
      calificationsParams += 'null/' ;
    }
    if (this.dateFinalQualityMonth) {
      calificationsParams +=  this.dateFinalQualityMonth + '/';
    } else {
      calificationsParams += 'null/' ;
    }
    if (this.dateInitQualityIssued) {
      calificationsParams += this.dateInitQualityIssued + '/';
    } else {
      calificationsParams += 'null/' ;
    }
    if (this.dateFinalQualityIssued) {
      calificationsParams += this.dateFinalQualityIssued + '/';
    } else {
      calificationsParams += 'null/' ;
    }
    if (this.paginationToken) {
      calificationsParams += encodeURI(this.paginationToken) + '/';
    } else {
      this.calificationsParams += 'null/' ;
    }
    if (this.pageSize) {
      calificationsParams += this.pageSize;
    } else {
      calificationsParams += '50' ;
    }

    return calificationsParams;
  }

  setTable(res: any) {
    if (res) {
      if (this.onlyOne) {
        this.length = res.count;
        this.arrayPosition = [];
        this.arrayPosition.push('{}');
      }
      this.showEmpty = false;
      this.sortedData = this.mapItems(
        res.viewModel,
    );
      this.dataSource = new MatTableDataSource(this.sortedData);
      this.savePaginationToken(res.paginationToken);
    } else {
      this.length = 0;
      this.showEmpty = false;
    }
    this.onlyOne = false;
  }

  mapItems(items: any[]): any[] {
    return items.map(x => {
        return {
            idSeller: x.idSeller,
            qualitative: x.qualitative,
            qualificationDate: x.qualificationDate,
            generatedDate: x.generatedDate,
            qualificationDateFormt: this.formtDateMonthYear(x.qualificationDate),
            generatedDateFormt: this.formtDateDayMonthYear(x.generatedDate),
        };
    });
}

formtDateMonthYear(date: any) {
  const formtDateMonth = date.toString().substr(-2, 2);
  const formtDateYear = date.toString().substr(-20, 4);
  return formtDateMonth + '/' + formtDateYear ;
}
formtDateDayMonthYear(date: any) {
  const format = 'DD/MM/YYYY';
  const stringDate = moment(date.toString()).utc().format(format).toString();
  return stringDate;
}

  savePaginationToken(paginationToken: string) {
    if (paginationToken) {
      this.paginationToken = paginationToken;
    }
  }


  contentDetails(qualificationDate: string, idSeller: number) {
    this.loadingService.viewSpinner();
    if (qualificationDate && idSeller) {
      const params = idSeller + '/' + qualificationDate;
      this.calificationService.getListCalificationsBySeller(params).subscribe((res: any) => {
        this.detailByElemet = res.ViewModel;
        this.loadingService.closeSpinner();
        this.showContainerDetail = true;
      });
    }
  }




  toggleFilterCalifications() {
    this.sidenavSearchOrder.toggle();
  }


  filterCalification(form: any) {

    if (form) {
      if (form.dateInitQualityMonth) {
        this.dateInitQualityMonth = this.formtDateYearMonth(form.dateInitQualityMonth);
      }
      if (form.dateFinalQualityMonth) {
        this.dateFinalQualityMonth = this.formtDateYearMonth(form.dateFinalQualityMonth);
      }
      if (form.dateInitQualityIssued) {
        this.dateInitQualityIssued = this.formtDateYearMonth(form.dateInitQualityIssued);
      }
      if (form.dateFinalQualityIssued) {
        this.dateFinalQualityIssued = this.formtDateYearMonth(form.dateFinalQualityIssued);
      }
    }
    const params = {
      callOne : true,
    };
    this.getCalificationsBySeller(params);
  }

  formtDateYearMonth(valueDate: string) {
    if (valueDate && valueDate.includes('/')) {
      const arrayDate = valueDate.split('/');
      return arrayDate[1] + arrayDate[0];
    }
  }

  formatNameMonth(date: string) {
    const formtDateMonth = date.toString().substr(-2, 2);
    const formtDateYear = date.toString().substr(-20, 4);
    const month = this.monthES[parseInt(formtDateMonth, 0) - 1];
   return month + ' (' + formtDateYear + ')';
  }

  clearForm() {
    this.filterCalifications.reset();
    this.dateInitQualityMonth = '';
    this.dateFinalQualityMonth = '';
    this.dateInitQualityIssued = '';
    this.dateFinalQualityIssued = '';
    this.params = {
      callOne: 'true'
    };
    this.getCalificationsBySeller(this.params);
    this.toggleFilterCalifications();
  }

}
