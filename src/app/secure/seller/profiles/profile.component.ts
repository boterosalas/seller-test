import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Logger, LoadingService } from '@app/core';
import { ProfileModel } from './models/profile.model';
import { MatDialog } from '@angular/material';
import { DialogProfileComponent } from './dialog/profile-dialog.component';
import { MenuModel } from './models/menu.model';
import { MenuModel as menuMode, readFunctionality, updateFunctionality, createFunctionality, profileName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';


const log = new Logger('ProfileComponent');

/**
 * Componente para administrar la vista de perfile, para listarlos, y llamar el componente dialogo de
 * crearlos.
 *
 * @export
 * @class ProfileComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-profiles',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.scss'],
})

export class ProfileComponent implements OnInit {

    profileTypes: Object[];
    profileList: ProfileModel[] = [];
    menuList: MenuModel[] = [];
    classMenu = new MenuModel(null, null, null, null, null);
    numberServices = 3;
    countServices = 0;

    /** Variables que contienen respuesta de modelo de servicio */
    nameProfile = 'Name';
    idProfile = 'idProfile';
    typeProfile = 'typeProfile';
    nameTypeProfile = 'ProfileType';
    menuProfile = 'Modules';
    typeProfileNumber = 'Shop';

    // Variables con los permisos que este componente posee
    permissionComponent: menuMode;
    read = readFunctionality;
    update = updateFunctionality;
    create = createFunctionality;

    /**
     * Servicios y componentes necesarios para iniciar el funcionamiento del componente.
     * @param {ProfileService} profileService
     * @param {LoadingService} loadingService
     * @memberof ProfileComponent
     */
    constructor(
        private profileService: ProfileService,
        private loadingService: LoadingService,
        public dialog: MatDialog,
        public authService: AuthService
    ) {
    }

    /**
     * Llama a la funcion que inicializa lo requerido para iniciar el componente.
     *
     * @memberof ProfileComponent
     */
    ngOnInit() {
        this.permissionComponent = this.authService.getMenu(profileName);
        this.initializeComponent();
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

    /**
     * Inicializa el componente.
     *
     * @private
     * @memberof ProfileComponent
     */
    private initializeComponent(): void {
        this.getRequiredData();
    }

    /**
     * Funcion que valida los datos para enviar o recibir de lista de perfiles.
     *
     * @public
     * @param {*} data
     * @returns {*}
     * @memberof ProfileComponent
     */
    public validateData(data: any): any {
        let validateData = null;
        if (data) {
            validateData = new ProfileModel(
                data[this.idProfile],
                data[this.nameProfile],
                data[this.typeProfile],
                data[this.nameTypeProfile],
                this.classMenu.ValidateData(data[this.menuProfile])
            );
            if (!validateData.Type) {
                validateData.Type = data[this.nameTypeProfile] === this.typeProfileNumber ? 1 : 0;
            }
        }
        return validateData;
    }

    /**
     * Obtiene los datos para el funcionamiento del componente.
     * 1. lista de tipos de perfiles.
     * 2. lista de perfiles por medio de un servicio.
     * TODO: Front sin API REST real.
     *
     * @memberof ProfileComponent
     */
    public getRequiredData(): void {
        this.loadingService.viewSpinner();
        this.profileTypes = this.profileService.getProfileTypes();
        this.verifyChargue();
        this.getProfileList().then(result => {
            this.verifyChargue();
        }, error => {
            this.verifyChargue();
            log.error('Error al cargar los perfiles', error);
        });
        this.getMenus().then(result => {
            this.verifyChargue();
        });
    }

    /**
     * Funcion que verifica si todos los rest poseen ya respuesta para cargar todo el componente.
     *
     * @memberof ProfileComponent
     */
    public verifyChargue(): void {
        this.countServices++;
        if (this.countServices >= this.numberServices) {
            this.loadingService.closeSpinner();
        }
    }

    /**
     * Obtiene los menus del servicio.
     *
     * @private
     * @returns {Promise<Boolean>}
     * @memberof ProfileComponent
     */
    private getMenus(): Promise<Boolean> {
        return new Promise((resolve, rej) => {
            this.profileService.getMenus().subscribe(result => {
                if (result && result.body) {
                    const data = JSON.parse(result.body);
                    this.menuList = this.classMenu.ValidateData(data.Data);
                    resolve(true);
                } else {
                    log.error('Fallo al intentar obtener la lista de perfiles');
                }
            }, error => {
                console.error(error);
                rej(false);
            });
        });
    }

    /**
     * Obtiene la lista de perfiles por medio del servicio.
     *
     * @private
     * @returns {Promise<Boolean>}
     * @memberof ProfileComponent
     */
    private getProfileList(): Promise<Boolean> {
        return new Promise((resolve, rej) => {
            this.profileService.getProfileList().subscribe(result => {
                if (result && result.body) {
                    const data = JSON.parse(result.body);
                    data.Data.forEach(element => {
                        this.profileList.push(this.validateData(element));
                    });
                    resolve(true);
                } else {
                    log.error('Fallo al intentar obtener la lista de perfiles');
                }
            }, error => {
                console.error(error);
                rej(false);
            });
        });
    }

    /**
     * Abre el dialogo de perfiles.
     *
     * @param {ProfileModel} dataToEdit
     * @memberof ProfileComponent
     */
    public openDialogProfile(dataToEdit: ProfileModel): void {
        const dialogRef = this.dialog.open(DialogProfileComponent, {
            minWidth: '360px',
            width: '80%',
            maxWidth: '800px',
            data: { menu: this.menuList, data: dataToEdit }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
