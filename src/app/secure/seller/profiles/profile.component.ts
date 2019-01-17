import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Logger, LoadingService } from '@app/core';
import { ProfileModel } from './models/profile.model';
import { Const } from '@app/shared';
import { MatDialog } from '@angular/material';
import { DialogProfileComponent } from './dialog/profile-dialog.component';
import { reject } from 'q';
import { MenuModel } from './models/menu.model';


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
    classMenu = new MenuModel(null, null, null, null);
    numberServices = 3;
    countServices = 0;

    /** Variables que contienen respuesta de modelo de servicio */
    nameProfile = 'nameProfile';
    idProfile = 'idProfile';
    typeProfile = 'typeProfile';
    nameTypeProfile = 'nameTypeProfile';
    menuProfile = 'menu';
    typeProfileNumber = '1';

    /**
     * Servicios y componentes necesarios para iniciar el funcionamiento del componente.
     * @param {ProfileService} profileService
     * @param {LoadingService} loadingService
     * @memberof ProfileComponent
     */
    constructor(
        private profileService: ProfileService,
        private loadingService: LoadingService,
        public dialog: MatDialog
    ) { }

    /**
     * Llama a la funcion que inicializa lo requerido para iniciar el componente.
     *
     * @memberof ProfileComponent
     */
    ngOnInit() {
        this.initializeComponent();
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
     * @private
     * @param {*} data
     * @returns {*}
     * @memberof ProfileComponent
     */
    private validateData(data: any): any {
        let validateData = null;
        if (data) {
            validateData = new ProfileModel(
                data[this.idProfile],
                data[this.nameProfile],
                data[this.typeProfile],
                data[this.nameTypeProfile],
                this.classMenu.ValidateData(data[this.menuProfile])
            );
            if (!validateData.TypeName) {
                validateData.TypeName = data[this.typeProfile] === this.typeProfileNumber ? Const.ProfileTypes[1] : Const.ProfileTypes[0];
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
        });
        this.getMenus().then(result => {
            this.verifyChargue();
        });
    }

    public verifyChargue(): void {
        this.countServices ++;
        if (this.countServices >= this.numberServices) {
            this.loadingService.closeSpinner();
        }
    }

    private getMenus(): Promise<Boolean> {
        return new Promise((resolve, rej) => {
            this.profileService.getMenus().subscribe(data => {
                if (data && data.length) {
                    this.menuList = this.classMenu.ValidateData(data);
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

    private getProfileList(): Promise<Boolean> {
        return new Promise((resolve, rej) => {
            this.profileService.getProfileList().subscribe(data => {
                if (data && data.length) {
                    data.forEach(element => {
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

    openDialogProfile(dataToEdit: ProfileModel): void {
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
