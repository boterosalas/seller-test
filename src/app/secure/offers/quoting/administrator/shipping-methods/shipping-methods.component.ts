import { Component, OnInit } from '@angular/core';
import { ShippingMethodsService } from './shipping-methods.service';
import { ShippingMethodsModel } from './shipping-methods.model';
import { ComponentsService } from '@app/shared';
import { Logger } from '@app/core';

const log = new Logger('CreateDialogComponent');

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.scss']
})
export class ShippingMethodsComponent implements OnInit {

  public shippingMethodsList: Array<ShippingMethodsModel>;

  constructor(private service: ShippingMethodsService,
              private componentService: ComponentsService) { }

  ngOnInit(): void {
    this.getRequiredData();
  }

  /**
   * Get from shiping methods a list with it
   *
   * @memberof ShippingMethodsComponent
   */
  public getRequiredData(): void {
    this.service.getShippingMethods().subscribe((res: any) => {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body);
        this.shippingMethodsList = body.Data;
      } else {
        log.error('Error al intentar obtener los metodos de envios');
      }
    });
  }
}
