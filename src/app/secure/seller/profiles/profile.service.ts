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
        }, {
            idProfile: 3,
            nameProfile: 'Vendedores API solo aqui',
            typeProfile: '0',
        }
    ];

    listMenus = [
        {
            idMenu: 1,
            nameMenu: 'Factura electronica',
            nameModule: 'Ordenes',
            funcionalities: [{
                id: 1,
                name: 'Listar'
            }, {
                id: 2,
                name: 'Editar'
            }]
        }, {
            idMenu: 2,
            nameMenu: 'Arbol de categorias',
            nameModule: 'Ordenes',
            funcionalities: [{
                id: 1,
                name: 'Listar'
            }, {
                id: 2,
                name: 'Editar'
            }, {
                id: 3,
                name: 'Agregar'
            }, {
                id: 4,
                name: 'Eliminar'
            }]
        }, {
            idMenu: 3,
            nameMenu: 'Cotizador',
            nameModule: 'Ordenes',
            funcionalities: [{
                id: 1,
                name: 'Listar'
            }, {
                id: 2,
                name: 'Editar'
            }, {
                id: 3,
                name: 'Agregar'
            }, {
                id: 4,
                name: 'Eliminar'
            }]
        }
    ];

    public getProfileList(): Observable<any> {
        return of(this.listProfiles);
    }

    public getProfileTypes(): any {
        return Const.ProfileTypes;
    }

    public getMenus(): Observable<any> {
        return of(this.listMenus);
    }
}
