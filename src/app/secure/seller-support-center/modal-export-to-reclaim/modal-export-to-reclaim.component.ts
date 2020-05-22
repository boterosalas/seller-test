import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '@app/store/store.service';
import { ConfigurationState } from '@app/store/configuration';
import { SellerSupportCenterService } from '../services/seller-support-center.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaseDetailResponse } from '../models/case-detail-response.model';
import { Filter } from '@app/shared/components/case-filter/models/Filter';


@Component({
  selector: 'app-modal-export-to-reclaim',
  templateUrl: './modal-export-to-reclaim.component.html',
  styleUrls: ['./modal-export-to-reclaim.component.scss']
})
export class ModalExportToReclaimComponent implements OnInit {

  filter: Filter = {
    CaseNumber: '',
    OrderNumber: null,
    ReasonPQR: null,
    Status: [],
    DateInit: '',
    DateEnd: '',
    SellerId: null
  };

  public form: FormGroup;
  headerConfigurations: any;
  options: any;
  case$: Observable<any>;
   // Modelo de ultima respuesta
   public lastPost = [
    { valuePost: 1, name: this.translateService.instant('secure.parametize.support_claims-filter.sac_answer') },
    { valuePost: 2, name: this.translateService.instant('secure.parametize.support_claims-filter.seller_answer') }
  ];


  constructor(
    public translateService: TranslateService,
    private sellerSupportService: SellerSupportCenterService,
    private storeService?: StoreService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.getStatusCase();
  }

  createForm() {
    this.form = new FormGroup({
        lastPost: new FormControl(''),
        importAll: new FormControl(''),
        dateInitial: new FormControl(''),
        dateFinal: new FormControl(''),
        status: new FormControl(''),
        email: new FormControl(''),
    });
}

getStatusCase() {
  this.storeService.getStateConfiguration().subscribe((res: ConfigurationState) => {
    const arrayLang = this.sellerSupportService.getListHeaderConfiguration();
    switch (res.language) {
      case 'ES':
        this.headerConfigurations = arrayLang[0].ES;
        break;

      case 'US':
        this.headerConfigurations = arrayLang[1].US;
        break;

      default:
        this.headerConfigurations = [];
    }
    this.options = res.statusCases;
    // this.case$ = this.sellerSupportService
    //   // .getCase(this.route.snapshot.paramMap.get('idCase'))
    //   .getCase(this.idDetail)
    //   // tslint:disable-next-line:no-shadowed-variable
    //   .pipe(map((res: CaseDetailResponse) => res.data));
  });
}

}
