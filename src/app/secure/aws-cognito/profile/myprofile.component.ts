import { Component, OnInit, ViewChild, TemplateRef, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService, LoadingService, ModalService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { MyProfileService } from './myprofile.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { DateService } from '@app/shared/util/date.service';
import { MenuModel, vacationFunctionality, cancelVacacionFunctionality } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

@Component({
    selector: 'app-awscognito',
    templateUrl: './myprofile.html',
    styleUrls: ['myprofile.component.scss']
})
export class MyProfileComponent implements LoggedInCallback, OnInit {

    profile = 'Perfil';
    public parameters: Array<Parameters> = [];
    public cognitoId: String;
    public user: any;
    form: FormGroup;
    isInVacation: boolean;
    isAdmin: boolean;
    vacationForm: FormGroup;
    tomorrow = DateService.getTomorrowDate();
    role: string;
    @ViewChild('dialogTemplate') content: TemplateRef<any>;
    @ViewChild('intialPicker') initialPicker;
    @ViewChild('endPicker') endPicker;

    // Permisos
    vacation = vacationFunctionality;
    cancelVacation = cancelVacacionFunctionality;
    canVacation: boolean;
    canCancelVacation: boolean;
    permissionComponent: MenuModel;

    otherUser: any;

    constructor(
        public router: Router,
        public userService: UserLoginService,
        private fb: FormBuilder,
        private sotreService: StoresService,
        private dialog: MatDialog,
        private loading: LoadingService,
        private modalService: ModalService,
        private profileService: MyProfileService,
        public authService: AuthService,
        private snackBar: MatSnackBar) {
            this.loading.viewSpinner();
    }

    ngOnInit() {
        this.initUserForm();
        this.initVacationForm();
        this.userService.isAuthenticated(this);
    }

    getPermissions() {
        this.authService.availableModules$.pipe(distinctUntilChanged()).subscribe(data => {
            if (!!data) {
                const modules = data.find(mod => mod.Name === this.profile);
                const menu = modules && modules.Menus.find(menu => menu.Name === this.profile );
                const actions = menu && menu.Actions;
                this.canVacation = actions && !!(actions.find(action => action === this.vacation));
                this.canCancelVacation = actions && !!(actions.find(action => action === this.cancelVacation));
            }
        });
    }

    /**
     * Formulario para la información del usuario
     */
    private initUserForm() {
        this.form = this.fb.group({
            Nit: [''],
            Email: [''],
            IdSeller: [''],
            Name: ['']
        });
    }

    /**
     * Metodo que abre el datepicker al cual se le da click
     * @param pos Posición del datePicker a abrir;
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

    /**
     * Genera el formulario para programar vacaciones
     */
    private initVacationForm() {
        this.vacationForm = this.fb.group({
            StartDateVacation: ['', Validators.compose([Validators.required])],
            EndDateVacation : ['', Validators.compose([Validators.required])]
        });
        this.startDateVacation.valueChanges.subscribe(val => {
            !!val && this.endDateVacation.reset(null);
        });
    }

    /**
     * Metodo que orquesta la creación del dialogo de programar vacaciones
     */
    sendToOpenVacationDialog() {
        const data = this.setDataVacationsDialog();
        const dialogInstance = this.openDialogVacation(data);
        this.setConfigVacationDialog(dialogInstance);
    }

    /**
     * Metodo que setea la configuración del dialogo
     */
    setConfigVacationDialog(dialogInstance: DialogWithFormComponent) {
        dialogInstance.content = this.content;
        dialogInstance.confirmation = () => {
            const vacationForm = this.vacationForm.value;
            if (vacationForm.StartDateVacation && vacationForm.EndDateVacation) {
                vacationForm.StartDateVacation = DateService.getDateFormatToRequest(vacationForm.StartDateVacation);
                vacationForm.EndDateVacation = DateService.getDateFormatToRequest(vacationForm.EndDateVacation);
            }
            this.loading.viewSpinner();
            this.sotreService.changeStateSeller(vacationForm).subscribe(response => {
                const body = response.body;
                if ( body && body.statusCode && body.statusCode === 201) {
                    const resultData = JSON.parse(body.body);
                    if (resultData && resultData.Message && resultData.Message === 'El usuario ha sido actualizado éxitosamente.') {
                        this.user.StartVacations = DateService.getDateFormatToShow(this.startDateVacation.value);
                        this.user.EndVacations = DateService.getDateFormatToShow(this.endDateVacation.value);
                        this.isInVacation = true;
                    } else {
                        this.profileService.getUser().toPromise().then(res => {
                            const body: any = res.body;
                            const response = JSON.parse(body.body);
                            const userData = response.Data;
                            this.setUserData(userData);
                        });
                    }
                } else {
                    this.modalService.showModal('errorService');
                }
                dialogInstance.onNoClick();
                this.loading.closeSpinner();
            });
        };
    }

    /**
     * Metodo que abre el dialogo de vacaciones
     * @param data Data del dialogo
     */
    openDialogVacation(data: any) {
        const dialogRef = this.dialog.open( DialogWithFormComponent, {
            data: data,
            width: '55%',
            minWidth: '280px'
        });
        return dialogRef.componentInstance;
    }

    /**
     * Metodo que retorna la data del dialogo de programar vacaciones
     */
    setDataVacationsDialog() {
        const title = 'Vacaciones';
        const message = 'Para programar la tienda en estado de vacaciones debes ingresar una fecha inicial y una fecha final para el periodo, y dar clic al botón PROGRAMAR. Los efectos solo tendrán lugar una vez empiece la fecha programada. Recuerda ofertar nuevamente una vez el periodo se haya cumplido, de lo contrario tus ofertas no se verán en los sitios.';
        const icon = 'local_airport';
        const form = this.vacationForm;
        return {title, message, icon, form};
    }

    /**
     *  Metodo que verifica si el usuario esta logeado o no, de estar logeado, obtiene la información del usuario
     * @param message
     * @param isLoggedIn
     */
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

    /**
     * Metodo que mapea la información de un usuario
     * @param user información del usuario
     */
    setUserData(user: any) {
        const startDate = new Date(user.StartVacations);
        const endDate = new Date(user.EndVacations);
        if (startDate.getFullYear() === 1 || endDate.getFullYear() === 1) {
            user.StartVacations = null;
            user.EndVacations = null;
        }
        this.user = Object.assign({}, user);
        this.isAdmin = !this.user.City;
        this.isInVacation = (!!this.user.StartVacations && !!this.user.EndVacations);
        if (this.isInVacation) {
            this.setVacationForm();
            this.user.StartVacations = DateService.getDateFormatToShow(new Date(this.user.StartVacations));
            this.user.EndVacations = DateService.getDateFormatToShow(new Date(this.user.EndVacations));
        }
        this.setUserForm(this.user);
    }

    /**
     * Metodo que actualiza la información de las vacaciones programadas para reProgramar las vacaciones
     */
    setVacationForm() {
        const startDate = DateService.getDateFormatToShow(this.user.StartVacations);
        const endDate = DateService.getDateFormatToShow(this.user.EndVacations);
        this.startDateVacation.setValue(DateService.stringToDate(startDate));
        this.endDateVacation.setValue(DateService.stringToDate(endDate));
    }

    /**
     * Metodo que actualiza el formulario de usuario con la data del usuario logeado
     * @param values
     */
    private setUserForm(values: any) {
        this.form.patchValue(values);
        this.Nit.disable();
        this.Email.disable();
        this.SellerId.disable();
        this.StoreName.disable();
        this.loading.closeSpinner();
        this.getPermissions();
    }

    /**
     * Metodo que orquesta la creación del dialogo de cancelar vacaciones
     */
    public sendToOpenCancelVacationDialog() {
        const dataForm = this.setDataCancelVacationsDialog();
        const dialogInstance = this.openCancelVacationDialog(dataForm);
        this.configCancelDialog(dialogInstance);
    }

    /**
     * metodo que gestiona la confimación del dialogo
     * @param dialog dialogo de cancelación de vacaciones
     * @param index posición del vendedor
     */
    configCancelDialog(dialog: DialogWithFormComponent){
        dialog.confirmation = () => {
            this.loading.viewSpinner();
            this.sotreService.cancelVacation({IdSeller: this.user.IdSeller}).subscribe(val => {
                if (val.status === 200) {
                    const body = val.body.body;
                    const message = JSON.parse(body);
                    if (body && message && message.Message && message.Message === 'El usuario ha sido actualizado éxitosamente.') {
                        this.user.StartVacations = null;
                        this.user.EndVacations = null;
                        this.isInVacation = false;
                        this.snackBar.open('Actualizado correctamente: ' + this.user.Name, 'Cerrar', {
                            duration: 3000,
                        });
                    } else {
                        this.profileService.getUser().toPromise().then(res => {
                            const body: any = res.body;
                            const response = JSON.parse(body.body);
                            const userData = response.Data;
                            this.setUserData(userData);
                        });
                    }
                } else {
                    this.modalService.showModal('errorService');
                }
                dialog.onNoClick();
                this.loading.closeSpinner();
            });
        };
    }

    /**
     * MEtodo que abre el dialogo con al data enviada por parametro
     * @param dataForm data a mostrar en el dialogo
     */
    openCancelVacationDialog(dataForm: any) {
        const dialogRef = this.dialog.open(DialogWithFormComponent, {
            data: dataForm,
            width: '55%',
            minWidth: '280px'
        });
        return dialogRef.componentInstance;
    }

    /**
     * Metodo que setea la data del formulario de cancelación de vacaciones programadas
     */
    setDataCancelVacationsDialog() {
        const message = '¿Estas seguro que deseas cancelar tu periodo de vacaciones? Si confirmas esta acción volverás a estado activo, si el periodo ya empezó deberás ofertar nuevamente todas tus ofertas';
        const title = 'Cancelar vacaciones';
        const icon = 'local_airport';
        const form = null;
        const messageCenter = false;
        return {message, title, icon, form, messageCenter};
    }

    /**
     * retorna el campo nit del formulario de usuario
     */
    get Nit(): FormControl {
        return this.form.get('Nit') as FormControl;
    }

    /**
     * retorna el campo Email del formulario de usuario
     */
    get Email(): FormControl {
        return this.form.get('Email') as FormControl;
    }

    /**
     * retorna el campo del nombre de la tienda del formulario de usuario
     */
    get StoreName(): FormControl {
        return this.form.get('Name') as FormControl;
    }

    /**
     * retorna el campo de identificación del vendedor del formulario de usuario
     */
    get SellerId(): FormControl {
        return this.form.get('IdSeller') as FormControl;
    }

    /**
     * retorna el campo de inicio de vacaciones del formulario de vacaciones
     */
    get startDateVacation(): FormControl{
        return this.vacationForm.get('StartDateVacation') as FormControl;
    }

    /**
     * retorna el campo de fin de vacaciones del formulario de vacaciones
     */
    get endDateVacation(): FormControl{
        return this.vacationForm.get('EndDateVacation') as FormControl;
    }
}



export class Parameters {
    name: string;
    value: string;
}
