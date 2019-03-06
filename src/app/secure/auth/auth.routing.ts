import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Modules, ModuleModel, MenuModel, ProfileTypes } from './auth.consts';
import { UserParametersService, CognitoUtil, UserLoginService, EndpointService } from '@app/core';
import { RoutesConst, Const } from '@app/shared';
import { AuthRoutingService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService implements CanActivate {

    modulesRouting: ModuleModel[] = Modules;
    modulesBack: ModuleModel[];
    userData: any;
    admin = 'administrator';
    adminType = 1;
    types = ['Tienda', 'Exito'];
    getData = false;

    constructor(public userParams: UserParametersService,
        public router: Router,
        public userService: UserLoginService,
        private http: HttpClient,
        private api: EndpointService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        console.warn('AuthService', state);
        console.warn('AuthService', route);
        // Promesa para verificar estados del usuario y la ruta a la que intenta entrar
        if (state.url !== '/' + RoutesConst.sellerCenterLogout) {
            return new Promise((resolve, reject) => {
                this.getModulesFromService().then(resultModule => {
                    this.modulesBack = resultModule;
                    const moduleSelected = this.validateModule(state.url); // Verfica a que menu desea ingresar
                    this.verifyLog(); // Verifica si esta logueado
                    if (moduleSelected) { // Verifica si si esta ingresando a un menu mapeado.
                        this.userParams.getUserData().then(data => {
                            this.userData = data;
                            // Valida si al menu que intenta ingresar posee el tipo del usuario.
                            const result = this.userData.sellerProfile === this.admin ? moduleSelected.ProfileType === ProfileTypes.Administrador : moduleSelected.ProfileType === ProfileTypes.Vendedor;
                            resolve(result);
                            this.redirectToHome(result, state);
                        }, error => {
                            console.error(error);
                            reject(false);
                            this.redirectToHome(false, state, true);
                        });
                    } else {
                        if (state.url === '/' + RoutesConst.sellerCenterIntDashboard) {
                            this.userParams.getUserData().then(data => {
                                this.userData = data;
                                // Valida si al menu que intenta ingresar posee el tipo del usuario.
                                resolve(true);
                            }, error => {
                                console.error(error);
                                reject(false);
                                this.redirectToHome(false, state, true);
                            });
                        } else {
                            this.redirectToHome(false, state);
                            reject(true);
                        }
                    }
                }, error => {

                });
            });
        } else {
            this.modulesBack = null;
            this.cleanModules();
            return true;
        }
    }

    /**
     * Limpiar modulos.
     *
     * @memberof AuthService
     */
    public cleanModules(): void {
        this.modulesRouting.forEach(item => {
            item.ShowModule = false;
            item.Menus.forEach(menu => {
                menu.ShowMenu = false;
                menu.Functionalities.forEach(functions => {
                    functions.ShowFunctionality = false;
                });
            });
        });
    }

    public getModulesFromService(): any {
        return new Promise((resolve, reject) => {
            if (!this.modulesBack) {
                this.http.get(this.api.get('getPermissions')).subscribe((result: any) => {
                    this.getData = true;
                    if (result.body) {
                        const data = JSON.parse(result.body);
                        if (data.Data && data.Data.Profile) {
                            const profileTye = data.Data.Profile.ProfileType;
                            data.Data.Profile.Modules.forEach(moduleItem => {
                                this.modulesRouting.forEach(item => {
                                    let showModule = false;
                                    if (item.NameModule.toLowerCase() === moduleItem.Name.toLowerCase()) {
                                        moduleItem.Menus.forEach(element => {
                                            item.Menus.forEach(menu => {
                                                if (this.types[menu.ProfileType] === profileTye && element.Name.toLowerCase() === menu.NameMenu.toLowerCase()) {
                                                    menu.ShowMenu = true;
                                                    showModule = true;
                                                    menu.Functionalities.forEach(functions => {
                                                        element.Actions.forEach(actions => {
                                                            if (functions.NameFunctionality.toLowerCase() === actions.toLowerCase()) {
                                                                functions.ShowFunctionality = true;
                                                            }
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                    }
                                    if (!item.ShowModule) {
                                        item.ShowModule = showModule;
                                    }
                                });
                            });
                            resolve(this.modulesRouting);
                        }
                    }
                }, error => {
                    reject(error);
                });
            } else {
                resolve(this.modulesBack);
            }
        });
    }

    /**
     * Redirecciona a la pagina principal.
     * no puedo hablar mucho entonces:
     * lo que hice fue que verificara si el usuario esta logeado, lo mande para el home (la primera vista de la lista),
     * pero si no esta logeado redirectLog, lo mande para el logout;
     *
     * @param {boolean} result
     * @memberof AuthService
     */
    public redirectToHome(result: boolean, state: RouterStateSnapshot, redirectLog: boolean = false): void {
        if (!result && !redirectLog) {
            let redirect = false;
            this.modulesRouting.forEach(element => {
                if (element.ShowModule) {
                    element.Menus.forEach(menu => {
                        if (menu.ShowMenu) {
                            redirect = true;
                            this.router.navigate([`/${menu.UrlRedirect}`]);
                        }
                    });
                }
            });
            if (!redirect) {
                this.router.navigate([`/${RoutesConst.sellerCenterLogout}`]);
            }
        } else if (redirectLog) {
            this.router.navigate([`/${RoutesConst.sellerCenterLogout}`]);
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
     * Valida el menu al que intenta acceder, con la URL y verifica con el ShowMenu,
     * si puede acceder como usuario o no. retorna null, si no posee permisos.
     *
     * @param {*} state
     * @returns {MenuModel}
     * @memberof AuthService
     */
    public validateModule(url: any): MenuModel {
        let moduleSelected: MenuModel;
        // a litle machete here because navigate with params give that params with ';'
        url = url.search(';') > -1 ? url.slice(0, url.search(';')) : url;
        Modules.forEach(item => {
            item.Menus.forEach(menu => {
                if (url === '/' + menu.UrlRedirect && menu.ShowMenu) {
                    moduleSelected = menu;
                }
            });
        });
        return moduleSelected;
    }

    /**
     * Obtener modulos, menus y funcionalidades.
     *
     * @returns {ModuleModel[]}
     * @memberof AuthService
     */
    public getModules(): any {
        return new Promise((resolve, reject) => {
            if (this.getData) {
                resolve(this.modulesRouting);
            } else {
                resolve(this.getModulesFromService());
            }
        });
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
