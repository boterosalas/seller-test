import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProfileModel } from '../models/profile.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuModel } from '../models/menu.model';
import { FunctionalityModel } from '../models/funcionality.model';

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

    constructor(
        public dialogRef: MatDialogRef<DialogProfileComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.dataToEdit = data.dataToEdit;
        this.menuList = data.menu;
        this.createForm(null);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    public createForm(data: any): void {
        this.profileForm = new FormGroup(
            {
                Name: new FormControl('', Validators.required),
                Type: new FormControl('', Validators.required),
                Menu: new FormControl(''),
                Funcionality: new FormControl(''),
            }
        );
    }

    public changeMenu(): void {
        this.dataToEdit = this.profileForm.controls.Menu.value.Id;
        // Functionalities
        this.functionalitiesList = this.profileForm.controls.Menu.value.Functionalities;
        this.profileForm.controls.Funcionality.setValue(null);
    }

    public changeFunctionality(): void {
    }

    public showMenu(menu: MenuModel): boolean {
        let exist = false;
        this.menuAddList.forEach(element => {
            if (menu.Id === element.Id) {
                exist = true;
            }
        });
        return exist;
    }

    public changeRadio(): void {
        this.menuAddList = [];
        this.functionalitiesList = [];
    }

    public addMenu(): void {
        if (this.profileForm.controls.Menu.value && this.profileForm.controls.Funcionality.value) {
            const menu = new MenuModel(
                this.profileForm.controls.Menu.value.Id,
                this.profileForm.controls.Menu.value.Name,
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

    public removeMenu(index: number): void {
        this.menuAddList.splice(index, 1);
    }
}
