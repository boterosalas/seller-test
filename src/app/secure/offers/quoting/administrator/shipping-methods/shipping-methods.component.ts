import { Component, OnInit } from '@angular/core';
import { ShippingMethodsService } from './shipping-methods.service';
import { ShippingMethodsModel } from './shipping-methods.model';

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.scss']
})
export class ShippingMethodsComponent implements OnInit {

  public shippingMethodsList: Array<ShippingMethodsModel>;

  constructor( private service: ShippingMethodsService) { }

  ngOnInit(): void {
    this.getRequiredData();
  }

  /**
   * Get from shiping methods a list with it
   *
   * @memberof ShippingMethodsComponent
   */
  public getRequiredData(): void {
    this.shippingMethodsList = this.service.getFakeListShipingMethods();
  }
}
