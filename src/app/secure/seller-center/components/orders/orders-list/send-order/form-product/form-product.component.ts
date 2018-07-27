/* 3rd party components */
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/* our own custom components */
import { OrderService } from '../../orders.service';
import { environment } from '../../../../../../../environments/environment';
import { SendOrderComponent } from '../send-order.component';
import { Logger } from '../../../../../utils/logger.service';
import { ProductsEntity, Order, Carries } from '../../../../../../../shared';
import { User } from '../../../../../../../shared/models/login.model';
import { ComponentsService } from '../../../../../utils/services/common/components/components.service';
import { Const } from '../../../../../../../shared/util/constants';

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

    // Armo el json que se enviara al servicio.
    const jsonProduct = {
      tracking: form.value.Guide,
      carrier: form.value.Transporter,
      shipDate: new Date(),
      idSeller: this.user.sellerId,
      idState: Const.OrderEnProcesoDeEnvio,
      products: [
        product.id
      ]
    };

    if (this.product.id != null) {
      this.orderService.sendProductOrder(jsonProduct, this.user, this.order.id, this.product.id).subscribe((res: any) => {
        this.componentsService.openSnackBar('Se ha enviado el producto correctamente', 'Cerrar', 4000);

        // armo un json con la información del producto y actualizo la guía y la transportadora.
        const productUpdate: ProductsEntity = product;
        productUpdate.tracking = form.value.Guide;
        productUpdate.carrier = form.value.Transporter;
        this.changeTrackingAndCarrierForProduct(productUpdate);
        // this.dialogRef.close(false);
      }, error => {
        this.componentsService.openSnackBar('Se ha presentado un error al enviar el producto', 'Cerrar', 4000);
        log.error(error);
      });
    } else {
      this.componentsService.openSnackBar('El producto seleccionado no puede ser enviado', 'Cerrar', 4000);
    }
  }

}

