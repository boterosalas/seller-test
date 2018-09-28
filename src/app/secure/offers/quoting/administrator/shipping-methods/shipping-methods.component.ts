import { Component, OnInit } from '@angular/core';
import { ShippingMethodsService } from './shipping-methods.service';
import { ShippingMethodsModel } from './shipping-methods.model';
import { ComponentsService } from '@app/shared';

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
    // this.shippingMethodsList = this.service.getFakeListShipingMethods();
    this.service.getShippingMethods().subscribe((res: any) => {
      console.log(res);
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body);
        this.shippingMethodsList = body.Data;
        console.log(this.shippingMethodsList);
      } else {
        console.log('Error al intentar obtener los metodos de envios');
      }
    });
  }
}
