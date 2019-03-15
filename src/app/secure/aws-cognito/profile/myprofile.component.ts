import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService, LoadingService, ModalService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { MatDialog } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { MyProfileService } from './myprofile.service';
import { map } from 'rxjs/operators';
import { DateService } from '@app/shared/util/date.service';

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
    isInVacation: boolean;
    isAdmin = true;
    vacationForm: FormGroup;
    today = new Date();
    role: string;
    @ViewChild('dialogTemplate') content: TemplateRef<any>;
    @ViewChild('intialPicker') initialPicker;
    @ViewChild('endPicker') endPicker;

    otherUser: any;

    constructor(
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        private fb: FormBuilder,
        private sotreService: StoresService,
        private dialog: MatDialog,
        private loading: LoadingService,
        private modalService: ModalService,
        private profileService: MyProfileService) {
            this.loading.viewSpinner();
    }

    ngOnInit() {
        this.initUserForm();
        this.initVacationForm();
        this.userService.isAuthenticated(this);
    }

    private initUserForm() {
        this.form = this.fb.group({
            Nit: [''],
            Email: [''],
            IdSeller: [''],
            Name: ['']
        });
    }

    /**
     * Method that open a specific datePicker at click an input
     * @param pos Pos of datepicker to open;
     */
    openPicker(pos: number) {
        switch (pos) {
            case 1:
            this.initialPicker.open();
            break;
            case 2:
            this.endPicker.open();
            break;
        }
    }

    private initVacationForm() {
        this.vacationForm = this.fb.group({
            StartDateVacation: ['', Validators.compose([Validators.required])],
            EndDateVacation : ['', Validators.compose([Validators.required])]
        });
        this.startDateVacation.valueChanges.subscribe(val => {
            !!val && this.endDateVacation.reset(null);
        });
    }

    openVacationDialog() {
        const title = 'Vacaciones';
        const message = 'Para programar la tienda en estado de vacaciones debes ingresar una fecha inicial y una fecha final para el periodo, y dar clic al botón PROGRAMAR. Los efectos solo tendrán lugar una vez empiece la fecha programada. Recuerda ofertar nuevamente una vez el periodo se haya cumplido, de lo contrario tus ofertas no se verán en los sitios.';
        const icon = 'local_airport';
        const form = this.vacationForm;
        const value = {title, message, icon, form};
        const dialogRef = this.dialog.open( DialogWithFormComponent, {
            data: value,
            width: '55%',
            minWidth: '280px'
        });
        const dialoginstance = dialogRef.componentInstance;
        dialoginstance.content = this.content;
        dialoginstance.confirmation = () => {
            const vacationForm = this.vacationForm.value;
            if (vacationForm.StartDateVacation && vacationForm.EndDateVacation) {
                vacationForm.StartDateVacation = DateService.getDateFormatToRequest(vacationForm.StartDateVacation);
                vacationForm.EndDateVacation = DateService.getDateFormatToRequest(vacationForm.EndDateVacation);
            }
            this.loading.viewSpinner();
            this.sotreService.changeStateSeller(form).subscribe(response => {
                const body = response.body;
                if ( body && body.statusCode && body.statusCode === 201) {
                    const resultData = JSON.parse(body.body);
                    if (resultData && resultData.Message) {
                        console.log(resultData.Message);
                    }
                } else {
                    this.modalService.showModal('errorService');
                }
                dialoginstance.onNoClick();
                this.loading.closeSpinner();
            });
        };
    }

    async isLoggedIn(message: string, isLoggedIn: boolean) {
        if (!isLoggedIn) {
            this.router.navigate([`/${RoutesConst.homeLogin}`]);
        } else {
            const user = await this.profileService.getUser().toPromise().then(res => {
                const body: any = res.body;
                const response = JSON.parse(body.body);
                const userData = response.Data;
                return userData;
            });
            this.setUserData(user);
        }
    }


    setUserData(user: any) {
        this.user = Object.assign(user);
        this.isAdmin = !this.user.City;
        this.isInVacation = (!!this.user.StartVacations && !!this.user.EndVacations);
        if (this.isInVacation) {
            this.setVacationForm();
            this.user.StartVacations = DateService.getDateFormatToShow(new Date(this.user.StartVacations));
            this.user.EndVacations = DateService.getDateFormatToShow(new Date(this.user.EndVacations));
        }
        this.setUserForm(this.user);
    }

    setVacationForm() {
        if (!this.vacationForm) {
            this.initVacationForm();
        }
        const startDate = new Date(this.user.StartVacations);
        const endDate = new Date(this.user.EndVacations);
        this.startDateVacation.setValue(startDate);
        this.endDateVacation.setValue(endDate);
    }

    getFormatDate(date: Date) {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    private setUserForm(values: any) {
        if (!!this.form) {
            this.form.patchValue(values);
            this.Nit.disable();
            this.Email.disable();
            this.SellerId.disable();
            this.StoreName.disable();
        }
        this.loading.closeSpinner();
    }

    public openCancelVacationDialog() {
        const dataForm = this.setDataCancelVacationsDialog();
        const dialogRef = this.dialog.open(DialogWithFormComponent, {
            data: dataForm,
            width: '55%',
            minWidth: '280px'
        });
        // const dialogInstance = dialogRef.componentInstance;
    }

    private setDataCancelVacationsDialog() {
        const message = '¿Estas seguro que deseas cancelar tu periodo de vacaciones? Si confirmas esta acción volverás a estado activo, si el periodo ya empezó deberás ofertar nuevamente todas tus ofertas';
        const title = 'Cancelar vacaciones';
        const icon = 'local_airport';
        const form = null;
        const messageCenter = false;
        return {message, title, icon, form, messageCenter};
    }

    get Nit(): FormControl {
        return this.form.get('Nit') as FormControl;
    }

    get Email(): FormControl {
        return this.form.get('Email') as FormControl;
    }

    get StoreName(): FormControl {
        return this.form.get('Name') as FormControl;
    }

    get SellerId(): FormControl {
        return this.form.get('IdSeller') as FormControl;
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
