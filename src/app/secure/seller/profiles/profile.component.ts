import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { Logger, LoadingService } from '@app/core';
import { ProfileModel } from './models/profile.model';
import { Const } from '@app/shared';


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

    /** Variables que contienen respuesta de modelo de servicio */
    nameProfile = 'nameProfile';
    idProfile = 'idProfile';
    typeProfile = 'typeProfile';
    nameTypeProfile = 'nameTypeProfile';
    typeProfileNumber = '1';

    constructor(
        private profileService: ProfileService,
        private loadingService: LoadingService
        ) { }

    ngOnInit() {
        this.initializeComponent();
    }

    private initializeComponent(): void {
        this.getRequiredData();
    }

    private validateData(data: any): any {
        let validateData = null;
        if (data) {
            validateData = new ProfileModel(
                data[this.idProfile],
                data[this.nameProfile],
                data[this.typeProfile],
                data[this.nameTypeProfile]
            );
            if (!validateData.TypeName) {
                validateData.TypeName = data[this.typeProfile] === this.typeProfileNumber ? Const.ProfileTypes[1] : Const.ProfileTypes[0];
            }
        }
        return validateData;
    }

    public getRequiredData(): void {
        this.loadingService.viewSpinner();
        this.profileTypes = this.profileService.getProfileTypes();
        this.profileService.getProfileList().subscribe(data => {
            if (data && data.length) {
                data.forEach(element => {
                    this.profileList.push(this.validateData(element));
                });
            } else {
                log.error('Fallo al intentar obtener la lista de perfiles');
            }
            this.loadingService.closeSpinner();
        }, error => {
            console.error(error);
            this.loadingService.closeSpinner();
        });
    }
}
