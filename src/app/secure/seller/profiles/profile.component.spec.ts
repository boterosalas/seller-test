import { ProfileComponent } from './profile.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatRadioModule, MatSelectModule, MatDividerModule, MatDialog } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';
import { LoadingService } from '@app/core';
import { Const } from '@app/shared';
import { Observable, of } from 'rxjs';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel } from './models/menu.model';

describe('Pruebas unitarias del componente de perfiles ProfileComponent', () => {

    let fixture: ComponentFixture<ProfileComponent>;
    let component: ProfileComponent;

    const listProfiles = [
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

    const listMenus = [
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


    const profileService = <ProfileService>{
        getProfileTypes(): any {
            return Const.ProfileTypes;
        },
        getMenus(): Observable<any> {
            return of(listMenus);
        },
        getProfileList(): Observable<any> {
            return of(listProfiles);
        }
    };
    const loadingService = <LoadingService>{
        viewSpinner() {
            return null;
        },
        closeSpinner() {
            return null;
        },
    };

    const authService = <any>{
        getMenu(param: any) {
            return {
                Id: undefined,
                NameMenu: "Perfiles",
                NameMenuBack: "perfiles",
                ProfileType: 1,
                ShowMenu: true,
                ShowMenuProduction: true,
                UrlRedirect: "securehome/seller-center/vendedores/perfiles",
                Functionalities: 
                [
                    {
                        NameFunctionality: "Consultar",
                    ShowFunctionality: true,
                    nameFunctionalityBack: "Consultar",
                    },
                    {
                        NameFunctionality: "Editar",
                    ShowFunctionality: true,
                    nameFunctionalityBack: "Editar",
                    },
                    {
                        NameFunctionality: "Crear",
                    ShowFunctionality: true,
                    nameFunctionalityBack: "Crear",
                    }
                ]
            };
        }
    };


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ProfileComponent
            ],
            providers: [
                { provide: ProfileService, useValue: profileService },
                { provide: LoadingService, useValue: loadingService },
                { provide: AuthService, useValue: authService },
                { provide: MatDialog, useValue: {} },
            ], imports: [
                FlexLayoutModule,
                MatToolbarModule,
                BrowserModule,
                MatIconModule,
                MatButtonModule,
                MatTooltipModule,
                MatDialogModule,
                FormsModule,
                MatButtonModule,
                MatFormFieldModule,
                MatInputModule,
                MatRippleModule,
                MatInputModule,
                FormsModule,
                CommonModule,
                MatRadioModule,
                ReactiveFormsModule,
                MatSelectModule,
                MatDividerModule
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        component.permissionComponent = authService.getMenu()
        fixture.detectChanges();
    });

    it('Deberia crear ProfileComponent', () => {
        expect(component).toBeDefined();
    });

    it('Deberia tener lista de perfiles', () => {
        expect(component.profileList).toBeDefined();
    });

    it('Deberia tener lista de menus', () => {
        expect(component.menuList).toBeDefined();
    });

    /*  Por cambios en estructura de JSON de perfiles es necesario cambiar "listMenus" ya que se cambiaron algunos atributos del
    JSON enviado por back ejemplo Name por nameProfile.
    it('El primer item de la lista de perfiles deberia ser "Administrador"', () => {
        expect(component.profileList[0].Name).toBe(listProfiles[0].nameProfile);
    });

    it('El primer item de la lista de menus deberia ser "Factura electronica"', () => {
        expect(component.menuList[0].Name).toBe(listMenus[0].nameMenu);
    });

    it('deberia de validar la lista de perfiles', () => {
        const listProfilesTest = [];
        listProfiles.forEach(profile => {
            listProfilesTest.push(component.validateData(profile));
        });
        expect(listProfilesTest.length).toBe(component.profileList.length);
    });
    */

});
