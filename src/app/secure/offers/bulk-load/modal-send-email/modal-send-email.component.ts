import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SendEmailService } from './send-email.service';

@Component({
  selector: 'app-modal-send-email',
  templateUrl: './modal-send-email.component.html',
  styleUrls: ['./modal-send-email.component.scss']
})
export class ModalSendEmailComponent implements OnInit {

  form: FormGroup;
  idSeller: any;
  constructor(
    private dialogRef: MatDialogRef<ModalSendEmailComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private languageService: TranslateService,
    private service: SendEmailService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.createForm();
    this.setData();
  }

  /**
   * Cierra la modal.
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Crea el formulario usado para solicitar el correo.
   */
  createForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
/**
 * funcion para setear el emial y el idSeller necesarios para consumir el servicio de envio 
 *
 * @memberof ModalSendEmailComponent
 */
setData() {
    const email = localStorage.getItem('email');
    this.idSeller = localStorage.getItem('userId');
    this.form.controls['email'].setValue(email);
  }
/**
 * funcion  para consumir el servicio de envio de correo de las ofertas
 *
 * @param {*} data
 * @memberof ModalSendEmailComponent
 */
sendEmail(data: any) {
    data.idseller = this.idSeller;
    this.service.getModeration(data).subscribe(res => {
      let message;
      if (res.status === 200) {
        if (res && res.body) {
          message = res.body['message'];
        } else {
          message = this.languageService.instant('secure.orders.download_order_modal.sn_download_order');
        }
      } else {
        message = this.languageService.instant('core.http.error_handler.error_acces');
      }
      this.snackBar.open(message, this.languageService.instant('actions.close'), {
        duration: 3000
      });
      this.onNoClick();
    });
  }
}
