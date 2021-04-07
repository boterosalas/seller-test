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
  public params = {
    idSeller : null,
    consult: false,
    type: 'admin'
  };


  constructor(
    public eventsSeller: EventEmitterSeller
  ) { }
/**
 * funcion para escuchar el cambio de vendedor en la barra de busqueda 
 *
 * @memberof ConsultIndicatorsComponent
 */
ngOnInit() {
    this.searchSubscription = this.eventsSeller.eventSearchSeller.subscribe((seller: StoreModel) => {
      if (seller) {
        this.params = {
          idSeller : seller.IdSeller,
          consult: true,
          type: 'admin'
        };
      } else {
        this.params = {
          idSeller: null,
          consult: false,
          type: 'admin'
        };
      }
    });
  }

}
