import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { MatDialog } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { fbind } from 'q';

@Component({
    selector: 'app-awscognito',
    templateUrl: './myprofile.html',
    styleUrls: ['myprofile.component.scss']
})
export class MyProfileComponent implements LoggedInCallback, OnInit {

    public parameters: Array<Parameters> = [];
    public cognitoId: String;
    public user: any;
    form: FormGroup;
    isInVacation: boolean = false;
    isAdmin = false;
    vacationForm: FormGroup;
    today = new Date();
    @ViewChild('dialogTemplate') content: TemplateRef<any>;

    constructor(
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil,
        private fb: FormBuilder,
        private sotreService: StoresService,
        private dialog: MatDialog) {
        this.userService.isAuthenticated(this);
    }
    
    ngOnInit(){
        this.initUserForm();
        this.initVacationForm();
    }

    private initUserForm() {
        this.form = this.fb.group({
            Nit: [''],
            Email: [''],
            SellerId: [''],
            StoreName: ['']                        
        });
    }

    private initVacationForm(){
        this.vacationForm = this.fb.group({
            StartDateVacation: ['', Validators.compose([Validators.required])],
            EndDateVacation : ['', Validators.compose([Validators.required])]
        });
    }

    openDialog() {
        const title = "Vacaciones";
        const message = "Para programar la tienda en estado de vacaciones debes ingresar una fecha inicial y una fecha final para el periodo, y dar clic al botón PROGRAMAR. Los efectos solo tendrán lugar una vez empiece la fecha programada. Recuerda ofertar nuevamente una vez el periodo se haya cumplido, de lo contrario tus ofertas no se verán en los sitios.";
        const icon = "local_airport"
        const form = this.form;
        const value = {title, message, icon, form}
        const dialogRef = this.dialog.open( DialogWithFormComponent, {
            data: value,
            width: '55%',
            minWidth: '280px'
        });
        const dialoginstance = dialogRef.componentInstance;
        dialoginstance.content = this.content;
    }

    async isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.homeLogin}`]);
        } else {
            this.user = await this.userParams.getParameters(true);
            const Nit = this.user.find(element => element.Name == 'custom:Nit').Value;
            const Email = this.user.find(element => element.Name == 'email').Value;
            const SellerId = this.user.find(element => element.Name == "custom:SellerId").Value;
            const StoreName = this.user.find(element => element.Name == "name").Value;
            this.setForm({Nit, Email, SellerId, StoreName});
        }
    }
    
    private setForm(values: any) {
        this.form.patchValue(values);
        this.Nit.disable();
        this.Email.disable();
        this.SellerId.disable();
        this.StoreName.disable();
    }

    get Nit(): FormControl {
        return this.form.get('Nit') as FormControl;
    }

    get Email(): FormControl {
        return this.form.get('Email') as FormControl;
    }

    get StoreName(): FormControl {
        return this.form.get('StoreName') as FormControl;
    }

    get SellerId(): FormControl {
        return this.form.get('SellerId') as FormControl;
    }

    get startDateVacation(): FormControl{
        return this.vacationForm.get('StartDateVacation') as FormControl;
    }

    get endDateVacation(): FormControl{
        return this.vacationForm.get('EndDateVacation') as FormControl;
    }
}



export class Parameters {
    name: string;
    value: string;
}
