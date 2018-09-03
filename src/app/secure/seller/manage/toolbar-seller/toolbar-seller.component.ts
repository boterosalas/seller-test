import { Component, OnInit } from '@angular/core';
import { EventEmitterSeller } from './../events/eventEmitter-seller.service';
import { ShellComponent } from '@core/shell/shell.component';
import { IsLoadInformationForTree } from '@app/secure/offers/stores/models/store.model';
import { StoresService } from '@app/secure/offers/stores/stores.service';


@Component({
  selector: 'app-toolbar-seller',
  templateUrl: './toolbar-seller.component.html',
  styleUrls: ['./toolbar-seller.component.scss']
})
export class ToolbarSellerComponent implements OnInit {

  constructor(
    public eventsStore: EventEmitterSeller,
    public storesService: StoresService,
    public shell: ShellComponent) { }

  ngOnInit(): void { }

}
