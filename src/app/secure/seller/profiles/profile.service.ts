import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Const } from '@app/shared';
import { HttpClient } from '@angular/common/http';
import { EndpointService } from '@app/core';

@Injectable()
export class ProfileService {

    constructor(private http: HttpClient,
        private api: EndpointService) { }

    listProfiles = [
        {
            idProfile: 1,
            nameProfile: 'Administrador',
            typeProfile: '1',
            nameTypeProfile: 'Administrador',
            menu: [{
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
            }]
        }, {
            idProfile: 2,
            nameProfile: 'Envios Exito',
            typeProfile: '0',
            menu: []
        }, {
            idProfile: 3,
            nameProfile: 'Vendedores',
            typeProfile: '1',
            menu: []
        }, {
            idProfile: 3,
            nameProfile: 'Vendedores API solo aqui',
            typeProfile: '0',
            menu: []
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
        // return of(this.listProfiles);
        return this.http.get(this.api.get('getAllProfiles'));
    }

    public getProfileTypes(): any {
        return Const.ProfileTypes;
    }

    public getMenus(): Observable<any> {
        // return of(this.listMenus);
        return this.http.get(this.api.get('getAllModule'));
    }

    public createProfile(data: any): Observable<any> {
        return this.http.post(this.api.get('createProfile'), data);
    }

    public updateProfile(data: any): Observable<any> {
        return this.http.post(this.api.get('updateProfile'), data);
    }
}
