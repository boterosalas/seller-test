import { Component, OnInit } from '@angular/core';
import { ShellComponent } from '@core/shell/shell.component';
import { StoresService } from '@app/secure/offers/stores/stores.service';


@Component({
  selector: 'app-toolbar-seller',
  templateUrl: './toolbar-seller.component.html',
  styleUrls: ['./toolbar-seller.component.scss']
})
export class ToolbarSellerComponent implements OnInit {

  constructor(
    public storesService: StoresService,
    public shell: ShellComponent) { }

  ngOnInit(): void { }

}
