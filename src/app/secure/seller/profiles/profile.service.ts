import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Const } from '@app/shared';

@Injectable()
export class ProfileService {

    constructor() { }

    listProfiles = [
        {
            idProfile: 1,
            nameProfile: 'Administrador',
            typeProfile: '1',
            nameTypeProfile: 'Administrador'
        }, {
            idProfile: 2,
            nameProfile: 'Envios Exito',
            typeProfile: '0',
        }, {
            idProfile: 3,
            nameProfile: 'Vendedores',
            typeProfile: '1',
        }
    ];

    public getProfileList(): Observable<any> {
        return of(this.listProfiles);
    }

    public getProfileTypes(): any {
        return Const.ProfileTypes;
    }
}
