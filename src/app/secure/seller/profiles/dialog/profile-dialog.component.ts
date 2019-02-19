import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileModel } from '../models/profile.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuModel } from '../models/menu.model';
import { FunctionalityModel } from '../models/funcionality.model';
import { Const } from '@app/shared';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-profile-dialog',
    templateUrl: 'profile-dialog.component.html',
    styleUrls: ['profile-dialog.component.scss']
})
export class DialogProfileComponent {

    dataToEdit: ProfileModel;
    menuList: MenuModel[] = [];
    menuAddList: MenuModel[] = [];
    functionalitiesList: FunctionalityModel[];
    profileForm: FormGroup;
    profileTypes = Const.ProfileTypesBack;
    menuShowList = [];
    editMode = false;

    /**
     * Creates an instance of DialogProfileComponent.
     * @param {MatDialogRef<DialogProfileComponent>} dialogRef
     * @param {*} data
     * @param {ProfileService} profileService
     * @memberof DialogProfileComponent
     */
    constructor(
        public dialogRef: MatDialogRef<DialogProfileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public profileService: ProfileService
    ) {
        this.dataToEdit = data.data;
        this.menuList = data.menu;
        this.createForm(this.dataToEdit);
    }

    /**
     * Cerrar el dialogo.
     */
    onNoClick(): void {
        this.dialogRef.close();
    }

    /**
     * Crear formulario.
     *
     * @param {*} data
     * @memberof DialogProfileComponent
     */
    public createForm(data: any): void {
        let dataToEdit = {
            Name: '',
            Type: ''
        };
        // Si posee datos se inicia el modo de edicion.
        if (data) {
            dataToEdit = data;
            data.Menus.forEach(element => {
                element.Menus.forEach(menu => {
                    this.menuAddList.push(menu);
                });
            });
            this.menuList.forEach(element => {
                if (element.ProfileType === this.profileTypes[1]) {
                    this.menuShowList.push(element);
                }
            });
            this.editMode = true;
        }

        this.profileForm = new FormGroup(
            {
                Name: new FormControl({value: dataToEdit.Name, disabled: this.editMode}, Validators.required),
                Type: new FormControl(dataToEdit.Type + '', Validators.required),
                Menu: new FormControl(''),
                Funcionality: new FormControl(''),
            }
        );
    }

    /**
     * Change event: se ejecuta cuando se cambia una opcion en el menu.
     *
     * @memberof DialogProfileComponent
     */
    public changeMenu(): void {
        if (this.profileForm.controls.Menu.value) {
            this.dataToEdit = this.profileForm.controls.Menu.value.Id;
        }
        // Functionalities
        this.functionalitiesList = this.profileForm.controls.Menu.value.Functionalities;
        this.profileForm.controls.Funcionality.setValue(null);
    }

    public changeFunctionality(): void {
    }

    public showMenu(menu: MenuModel): boolean {
        let exist = false;
        this.menuAddList.forEach(element => {
            if (menu.Name === element.Name) {
                exist = true;
            }
        });
        return exist;
    }

    public changeRadio(): void {
        this.menuAddList = [];
        this.functionalitiesList = [];
        if (!this.profileForm.value.Type) {
            this.menuList.forEach(element => {
                if (element.ProfileType === this.profileTypes[1]) {
                    this.menuShowList.push(element);
                }
            });
        } else {
            this.menuList.forEach(element => {
                if (element.ProfileType === this.profileTypes[0]) {
                    this.menuShowList.push(element);
                }
            });
        }
    }

    /**
     * Agregar un menu.
     *
     * @memberof DialogProfileComponent
     */
    public addMenu(): void {
        if (this.profileForm.controls.Menu.value && this.profileForm.controls.Funcionality.value) {
            const menu = new MenuModel(
                this.profileForm.controls.Menu.value.Id,
                this.profileForm.controls.Menu.value.Name,
                null,
                null,
                null
            );
            menu.Functionalities = this.profileForm.controls.Funcionality.value;
            this.menuAddList.push(menu);
            this.functionalitiesList = [];
            this.profileForm.controls.Menu.setValue(null);
            this.profileForm.controls.Funcionality.setValue(null);
        }
    }

    /**
     * Guardar el perfil.
     *
     * @memberof DialogProfileComponent
     */
    public saveProfile(): void {
        const dataToSend = {
            Name: this.profileForm.value.Name,
            ProfileType: Const.ProfileTypesBack[this.profileForm.value.Type],
            Modules: this.validModulesToSend()
        };

        if (!this.dataToEdit) {
            this.profileService.createProfile(dataToSend).subscribe(data => {
                this.onNoClick();
            }, error => {
                console.error(error);
            });
        } else {
            this.profileService.updateProfile(dataToSend).subscribe(data => {
                this.onNoClick();
            }, error => {
                console.error(error);
            });
        }
    }

    /**
     * Valida los modulos para ser agregados.
     *
     * @returns {*}
     * @memberof DialogProfileComponent
     */
    public validModulesToSend(): any {
        const modules = [];
        this.menuList.forEach((menu: any) => {
            menu.Menus.forEach(item => {
                this.menuAddList.forEach((element: any) => {
                    if (item.Name === element.Name && menu.ProfileType === Const.ProfileTypesBack[this.profileForm.value.Type]) {
                        let existModule = false;
                        let indexModule = 0;
                        element.Actions = [];
                        element.Functionalities.forEach(functions => {
                            element.Actions.push(functions.Name);
                        });
                        modules.forEach((modulItem: any, index: number) => {
                            if (modulItem.Name === element.Name) {
                                existModule = true;
                                indexModule = index;
                            }
                        });
                        if (!existModule) {
                            modules.push({
                                Name: menu.Name,
                                Menus: [element],
                                ProfileType: Const.ProfileTypesBack[this.profileForm.value.Type]
                            });
                        } else {
                            modules[indexModule].Menus.push(element);
                        }
                    }
                });
            });
        });
        return modules;
    }

    /**
     * Remover un menu.
     *
     * @param {number} index
     * @memberof DialogProfileComponent
     */
    public removeMenu(index: number): void {
        this.menuAddList.splice(index, 1);
    }
}
