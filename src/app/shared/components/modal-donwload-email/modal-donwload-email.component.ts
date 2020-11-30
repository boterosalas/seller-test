import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserParametersService } from '@app/core';
import { DownloadBillingpayModalComponent } from '@app/secure/billing/download-billingpay-modal/download-billingpay-modal.component';
import { ComponentsService, UserInformation } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-donwload-email',
  templateUrl: './modal-donwload-email.component.html',
  styleUrls: ['./modal-donwload-email.component.scss']
})
export class ModalDonwloadEmailComponent implements OnInit {

   public myform: FormGroup;
   public user: UserInformation;
   public limitLengthBillingpay: any = 0;

   public title = 'Reporte';
   public btn = 'Enviar';
   processFinish$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<DownloadBillingpayModalComponent>,
    public componentsService: ComponentsService,
    public userParams: UserParametersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private languageService: TranslateService
  ) { }

  /**
   * @memberof DownloadBillingpayModalComponent
   */
  ngOnInit() {
    this.createForm();
    this.getDataUser();
    this.parametersModal();
  }
/**
 *
 *
 * @memberof ModalDonwloadEmailComponent
 */
createForm() {
    this.myform = new FormGroup({
      email: new FormControl({ disabled: false }, [
        Validators.required,
        Validators.email
      ])
    });
  }
/**
 *
 *
 * @memberof ModalDonwloadEmailComponent
 */
async getDataUser() {
    this.user = await this.userParams.getUserData();
    this.myform.controls['email'].setValue(this.user.sellerEmail);
  }

/**
 *
 *
 * @memberof ModalDonwloadEmailComponent
 */
onNoClick(): void {
    this.dialogRef.close(false);
  }
/**
 *
 *
 * @memberof ModalDonwloadEmailComponent
 */
parametersModal() {
    this.title = this.data.title;
    this.btn = this.data.btn;
  }

  dowrloadReport( form: any) {
    this.processFinish$.next(form);
  }
}
