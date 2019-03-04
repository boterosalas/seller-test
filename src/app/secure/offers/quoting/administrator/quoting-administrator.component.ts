import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel, transportName, readFunctionality, createFunctionality, updateFunctionality, deleteFunctionality, zonesName, quoteName } from '@app/secure/auth/auth.consts';
import { QuotingAdminService } from './quoting-administrator.service';

@Component({
  selector: 'app-quoting-administrator',
  templateUrl: './quoting-administrator.component.html',
  styleUrls: ['./quoting-administrator.component.scss']
})
export class QuotingAdministratorComponent implements OnInit {

  // Variables con los permisos que este componente posee.
  permissionComponent: MenuModel;
  readTransport = `${readFunctionality} ${transportName}`;
  createTransport = `${createFunctionality} ${transportName}`;
  updateTransport = `${updateFunctionality} ${transportName}`;
  deleteTransport = `${deleteFunctionality} ${transportName}`;
  readZone = `${readFunctionality} ${zonesName}`;
  creatZone = `${createFunctionality} ${zonesName}`;
  updateZone = `${updateFunctionality} ${zonesName}`;
  deleteZone = `${deleteFunctionality} ${zonesName}`;
  // Permisos para modificar el html.
  readTransportFunction: boolean;
  createTransportFunction: boolean;
  updateTransportFunction: boolean;
  deleteTransportFunction: boolean;
  readZoneFunction: boolean;
  createZoneFunction: boolean;
  updateZoneFunction: boolean;
  deleteZoneFunction: boolean;

  constructor(public authService: AuthService,
    private quotingService: QuotingAdminService) { }

  ngOnInit(): void {
    this.permissionComponent = this.authService.getMenu(quoteName);
    // Cuando ud necesite ver el menu con las funciones imprime esto:
    console.log(this.permissionComponent);
    this.readTransportFunction = this.getFunctionality(this.readTransport);
    this.createTransportFunction = this.getFunctionality(this.createTransport);
    this.updateTransportFunction = this.getFunctionality(this.updateTransport);
    this.deleteTransportFunction = this.getFunctionality(this.deleteTransport);
    this.readZoneFunction = this.getFunctionality(this.readZone);
    this.createZoneFunction = this.getFunctionality(this.creatZone);
    this.updateZoneFunction = this.getFunctionality(this.updateZone);
    this.deleteZoneFunction = this.getFunctionality(this.deleteZone);
    if (!this.readZoneFunction) {
      this.quotingService.addToNumber();
    }
    if (!this.readTransportFunction) {
      this.quotingService.addToNumber();
      this.quotingService.addToNumber();
    }
  }

  /**
   * Funcion que verifica si la funcion del modulo posee permisos
   *
   * @param {string} functionality
   * @returns {boolean}
   * @memberof ToolbarComponent
   */
  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }
}
