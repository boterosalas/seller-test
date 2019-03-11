import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService } from '@app/core';
import { RoutesConst } from '@app/shared';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

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
    isInVacation: boolean = true;

    constructor(
        public router: Router,
        public userService: UserLoginService,
        public userParams: UserParametersService,
        public cognitoUtil: CognitoUtil,
        private fb: FormBuilder) {
        this.userService.isAuthenticated(this);
    }
    
    ngOnInit(){
        this.initForm();
    }

    private initForm() {
        this.form = this.fb.group({
            Nit: [''],
            Email: [''],
            SellerId: [''],
            StoreName: ['']                        
        });
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
}



export class Parameters {
    name: string;
    value: string;
}
