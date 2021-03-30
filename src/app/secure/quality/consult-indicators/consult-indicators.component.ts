import { Component, OnInit } from '@angular/core';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { SearchFormEntity } from '@app/shared';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

@Component({
  selector: 'app-consult-indicators',
  templateUrl: './consult-indicators.component.html',
  styleUrls: ['./consult-indicators.component.scss']
})
export class ConsultIndicatorsComponent implements OnInit {

  public informationToForm: SearchFormEntity = {
    title: 'Calidad',
    subtitle: 'menu.Consultar Indicadores',
    btn_title: 'Calidad',
    title_for_search: '',
    type_form: 'quality',
    information: null,
    count: null
  };
  public btnFilter = false;
  private searchSubscription: any;
  public btnDownload = false;
  public _Typeprofile = 1;
  public isFullSearch = false;
  public showContainerDetail = true;
  public showSearchSeller = true;
  public idSeller = null;


  constructor(
    public eventsSeller: EventEmitterSeller
  ) { }

  ngOnInit() {
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      if (seller) {
        this.idSeller = seller.IdSeller;
      }
    });
  }

}
