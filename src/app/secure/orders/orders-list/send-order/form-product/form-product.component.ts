import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from '@app/core';
import { Carries, ComponentsService, Const, Order, ProductsEntity } from '@app/shared';

import { OrderService } from '../../orders.service';
import { SendOrderComponent } from '../send-order.component';
import { TranslateService } from '@ngx-translate/core';

// log component
const log = new Logger('FormProductComponent');

/**
 * Component que se emplea para realizar el envío individual de un producto
 */
@Component({
  selector: 'app-form-product',
  templateUrl: './form-product.component.html',
  styleUrls: ['./form-product.component.scss'],
  providers: [
    SendOrderComponent
  ]
})

/**
 * Componente
 */
export class FormProductComponent implements OnInit {

  // Inputs que obtienens los datos pasados por el componente que importa el componente actual
  @Input() product: ProductsEntity;
  @Input() user: any;
  @Input() order: Order;
  @Input() dialogRef: any;
  international = false;
  idState: any;
  @Input() set isInternational (value: boolean){
    if (value !== undefined && value !== null) {
        this.international = value;
    }
  }
  // Lista de transportadoras.
  @Input() carries: Array<Carries> = [];
  // Evento que permite consultar las órdenes
  @Output() OnProductIsSend = new EventEmitter<object>();
  // Información del formulario
  myForm: FormGroup;

  /**
   * Creates an instance of FormProductComponent.
   * @param {FormBuilder} fb
   * @param {ComponentsService} componentsService
   * @param {SendOrderComponent} sendOrderComponent
   * @param {OrderService} orderService
   * @memberof FormProductComponent
   */
  constructor(private fb: FormBuilder,
    public componentsService: ComponentsService,
    public sendOrderComponent: SendOrderComponent,
    private languageService: TranslateService,
    public orderService: OrderService) {
  }


  /**
   * ngOnInit
   * @memberof FormProductComponent
   */
  ngOnInit() {
    this.createValidationInProductForSend();
  }

  /**
   * Evento que permite notificar cuando la guía y la transportadora de un producto ha cambiado
   * @param {any} product
   * @memberof FormProductComponent
   */
  changeTrackingAndCarrierForProduct(product) {
    this.OnProductIsSend.emit(product);
  }

  /**
   * Funcionalidad que se encarga de crear los componentes de validación que se emplearan
   * cuando el usuario seleccione un producto para ser enviado
   * @memberof FormProductComponent
   */
  async createValidationInProductForSend() {

    this.myForm = this.fb.group({
      'Transporter': [{ value: '', disabled: false }, Validators.required],
      // tslint:disable-next-line:max-line-length
      'Guide': [{ value: '', disabled: false }, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20)])],
    });
  }

  /**
   * Funcionalidad para realizar el envió de un producto en especifico.
   * @param {ProductsEntity} product
   * @param {any} form
   * @memberof FormProductComponent
   */
  sendProduct(product: ProductsEntity, form) {

    if (this.international) {
      this.idState = '35';
    } else {
      this.idState = Const.OrderEnProcesoDeEnvio;
    }
    // Armo el json que se enviara al servicio.
    const jsonProduct = {
      tracking: form.value.Guide,
      carrier: form.value.Transporter,
      shipDate: new Date(),
      idSeller: this.user.sellerId,
      idState: this.idState,
      products: [
        product.id
      ]
    };
    if (this.product.id != null) {
      this.orderService.sendProductOrder(jsonProduct, this.order.id, this.product.id).subscribe((res: any) => {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.send.send_correctly'), this.languageService.instant('actions.close'), 4000);
        const productUpdate: ProductsEntity = product;
        productUpdate.tracking = form.value.Guide;
        productUpdate.carrier = form.value.Transporter;
        this.changeTrackingAndCarrierForProduct(productUpdate);
        this.dialogRef.close(false);
        window.location.reload();
      }, error => {
        this.componentsService.openSnackBar(this.languageService.instant('secure.orders.send.error_ocurred_product'), this.languageService.instant('actions.close'), 4000);
        log.error(error);
      });
    } else {
      this.componentsService.openSnackBar(this.languageService.instant('secure.orders.send.cant_not_sent'), this.languageService.instant('actions.close'), 4000);
    }
  }

}

