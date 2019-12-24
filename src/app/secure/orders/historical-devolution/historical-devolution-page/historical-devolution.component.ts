import { Component, OnInit } from '@angular/core';
import { MenuModel, historicDevolution } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';

@Component({
  selector: 'app-historical-devolution',
  templateUrl: './historical-devolution.component.html',
  styleUrls: ['./historical-devolution.component.scss']
})
export class HistoricalDevolutionComponent implements OnInit {

  permissionComponent: MenuModel;


  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(historicDevolution);
  }

}
