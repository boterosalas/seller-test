import { Component, EventEmitter, HostListener, Input, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from '@env/environment';
import { ListAdminComponent } from '@app/secure/offers/list-admin/list-admin/list-admin.component';
import { TranslateService } from '@ngx-translate/core';

/**
 *
 * @export
 * @class DetailOfferComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-detail-offer',
  templateUrl: './detail-offer.component.html',
  styleUrls: ['./detail-offer.component.scss']
})

export class DetailOfferComponent implements OnInit {

  /**
   * @description Variable para controlar si el usuario esta editando la oferta.
   * @type {boolean}
   * @memberof DetailOfferComponent
   */
  public isUpdateOffer: boolean;

  /**
   * @description Variable para validar el formulario.
   * @type {FormGroup}
   * @memberof DetailOfferComponent
   */
  public formUpdateOffer: FormGroup;

  /**
   *
   *  @description Variables para controlar los campos del formulario.
   * @type {FormControl}
   * @memberof DetailOfferComponent
   */
  public Ean: FormControl;
  public Stock: FormControl;
  public Price: FormControl;
  public DiscountPrice: FormControl;
  public AverageFreightCost: FormControl;
  public PromiseDelivery: FormControl;
  public IsFreeShipping: FormControl;
  public IsEnviosExito: FormControl;
  public IsFreightCalculator: FormControl;
  public Warranty: FormControl;
  public IsLogisticsExito: FormControl;
  public IsUpdatedStock: FormControl;
  public Currency: FormControl;

  /**
   * @description Variable que almacena los datos que se le van a enviar al servcio.
   * @type {Array<any>}
   * @memberof DetailOfferComponent
   */
  public params: Array<any>;

  /**
   * @description Variable en la que almacena los datos de la oferta de la cual se quiere ver el detalle.
   * @memberof DetailOfferComponent
   */
  @Input() dataOffer;

  promiseFirts: string;
  promiseSeconds: string;
  to: string;
  periodicityHtml: string;

  /**
   *
   * @description Variable para controlar si es production o no
   * @memberof DetailOfferComponent
   */
  public isProductionEnv = environment.production;

  constructor(
    public list: ListAdminComponent,
    private languageService: TranslateService,
  ) {
    this.params = [];
  }

  /**
   * @method handleKeyboardEvent
   * @param event
   * @description Metodo para controlar cuando se presiona la tecla Esc y poder volver al listado de ofertas.
   * @memberof DetailOfferComponent
   */
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const evt = event.keyCode;
    if (evt === 27) {
      this.goToListOffers();
    }
  }

  /**
   * @method goToListOffers
   * @description Metodo para volver a listado de ofertas.
   * @memberof DetailOfferComponent
   */
  goToListOffers() {
    this.list.viewDetailOffer = false;
    this.list.inDetail = false;
  }

  ngOnInit() {
    this.setPromise();
  }
  /**
   * Descomponer la promesa de entrega
   *
   * @memberof DetailOfferComponent
   */
  setPromise() {
    if (this.dataOffer) {
      if (this.dataOffer.promiseDelivery) {
        const promiseDe = this.dataOffer.promiseDelivery.split(' ');
        this.promiseFirts = promiseDe[0];
        this.to = promiseDe[1];
        this.promiseSeconds = promiseDe[2];
      } else {
        this.promiseFirts = '';
        this.to = '';
        this.promiseSeconds = '';
      }

      if (this.dataOffer.periodicity === 1) {
        this.languageService.stream('secure.offers.historical_admin.historical_admin.day').subscribe(val => {
          this.periodicityHtml = val ;
        });
      } else {
        this.languageService.stream('secure.offers.historical_admin.historical_admin.hours').subscribe(val => {
          this.periodicityHtml = val ;
        });
      }
    }else {
      this.promiseFirts = '';
      this.to = '';
      this.promiseSeconds = '';
      this.periodicityHtml = '';
    }
  }
}
