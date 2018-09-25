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

  constructor(private service: ShippingMethodsService) { }

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
    /*this.service.getShippingMethods().subscribe((res: any) => {
      if (res.status === 200) {
          const body = JSON.parse(res.body.body);
          console.log(body.Data);
      } else {
        console.log('error');
        // Error here
      }
  });*/
  }
}
