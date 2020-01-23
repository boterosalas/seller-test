import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { ShellComponent } from '@app/core/shell';

@Component({
  selector: 'app-calification-list',
  templateUrl: './calification-list.component.html',
  styleUrls: ['./calification-list.component.scss']
})
export class CalificationListComponent implements OnInit {

  numberElements = 0;
  public informationToForm: SearchFormEntity = {
    title: 'module.Calidad',
    subtitle: 'menu.Calificación de vendedores',
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'orders',
    information: new InformationToForm,
    count: this.numberElements.toString()
  };
  typeProfile = 1;
  public subFilterOrder: any;
  public displayedColumns = [
    'channel'
  ];

  constructor(
    private shellComponent: ShellComponent,
  ) {
   }

  ngOnInit() {
  }

  getOrdersListSinceFilterSearchOrder() {
    this.subFilterOrder = this.shellComponent.eventEmitterOrders.filterOrderList.subscribe(
      (data: any) => {
        console.log(data);
      }
      );
    }

}
