import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst, UserInformation } from '@app/shared';
import { MenuModel, readFunctionality, updateFunctionality, categoriesTreeName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  public user: UserInformation;

  public tree: any;

  // Variables con los permisos que este componente posee.
  permissionComponent: MenuModel;
  read = readFunctionality;
  update = updateFunctionality;
  readFunction: boolean;
  updateFunction: boolean;

  constructor(
    public userService: UserLoginService,
    private cdRef: ChangeDetectorRef,
    public userParams: UserParametersService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.permissionComponent = this.authService.getMenu(categoriesTreeName);
    this.readFunction = this.getFunctionality(this.read);
    this.updateFunction = !this.getFunctionality(this.update);
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


  receiveDataTree($event: any) {
    if ($event && $event !== undefined && $event !== null) {
      this.tree = $event;
      this.cdRef.detectChanges();
    }
  }
}
