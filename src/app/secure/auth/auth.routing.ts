import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Modules, ModuleModel, MenuModel, ProfileTypes } from './auth.consts';
import { UserParametersService, CognitoUtil, UserLoginService } from '@app/core';
import { RoutesConst } from '@app/shared';

@Injectable()
export class AuthService implements CanActivate {

    modulesRouting: ModuleModel[] = Modules;
    userData: any;
    admin = 'administrator';

    constructor(public userParams: UserParametersService,
        public router: Router,
        public userService: UserLoginService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        console.warn('AuthService', state);
        console.warn('AuthService', route);
        // Promesa para verificar estados del usuario y la ruta a la que intenta entrar
        return new Promise((resolve, reject) => {
            const moduleSelected = this.validateModule(state.url); // Verfica a que menu desea ingresar
            console.warn('AuthService', moduleSelected);
            this.verifyLog(); // Verifica si esta logueado
            if (moduleSelected) { // Verifica si si esta ingresando a un menu mapeado.
                this.userParams.getUserData().then(data => {
                    this.userData = data;
                    console.warn('AuthService', this.userData);
                    // Valida si al menu que intenta ingresar posee el tipo del usuario.
                    const result = this.userData.sellerProfile === this.admin ? moduleSelected.ProfileType === ProfileTypes.Administrador : moduleSelected.ProfileType === ProfileTypes.Vendedor;
                    resolve(result);
                    this.redirectToHome(result);
                }, error => {
                    console.error(error);
                    reject(false);
                    this.redirectToHome(false);
                });
            } else {
                this.redirectToHome(false);
                return false;
            }
        });
    }

    /**
     * Redirecciona a la pagina principal.
     *
     * @param {boolean} result
     * @memberof AuthService
     */
    public redirectToHome(result: boolean): void {
        if (!result) {
            console.log('aqui');
            // this.router.navigate([`/${RoutesConst.home}`]);
        }
    }

    /**
     * Verifica si el usuario esta logueado.
     *
     * @memberof AuthService
     */
    public verifyLog(): void {
        this.userService.isAuthenticated(this);
    }

    /**
     * Vefica si esta logueado.
     *
     * @param {string} message
     * @param {boolean} isLoggedIn
     * @memberof AuthService
     */
    isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.home}`]);
        }
    }

    /**
     * Valida los menus y los modulos.
     *
     * @param {*} state
     * @returns {MenuModel}
     * @memberof AuthService
     */
    public validateModule(url: any): MenuModel {
        let moduleSelected: MenuModel;
        Modules.forEach(item => {
            const resultado = item.Menus.find(menu => url === '/' + menu.UrlRedirect);
            if (resultado) {
                moduleSelected = resultado;
                return true;
            }
        });
        if (moduleSelected && moduleSelected.ShowMenu) {
            return moduleSelected;
        } else {
            return null;
        }
    }

    /**
     * Obtener modulos, menus y funcionalidades.
     *
     * @returns {ModuleModel[]}
     * @memberof AuthService
     */
    public getModules(): ModuleModel[] {
        return this.modulesRouting;
    }

    /**
     * Obtener menu por nombre
     *
     * @returns {ModuleModel[]}
     * @memberof AuthService
     */
    public getMenu(nameMenu: any): MenuModel {
        let moduleSelected: MenuModel;
        Modules.forEach(item => {
            const resultado = item.Menus.find(menu => nameMenu === menu.NameMenu);
            if (resultado) {
                moduleSelected = resultado;
                return true;
            }
        });
        if (moduleSelected && moduleSelected.ShowMenu) {
            return moduleSelected;
        } else {
            return null;
        }
    }

    /**
     * Setear los modulos, menus y funcionalidades.
     *
     * @param {ModuleModel[]} modules
     * @memberof AuthService
     */
    public setModules(modules: ModuleModel[]): void {
        this.modulesRouting = modules;
    }


}
