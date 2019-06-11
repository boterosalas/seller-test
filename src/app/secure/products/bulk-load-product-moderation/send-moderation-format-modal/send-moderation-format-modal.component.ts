import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { Logger } from '@app/core';

import { SendModerationFormatModalService } from './send-moderation-format-modal.service';
import { LanguageService } from '@app/core/translate/language.service';


const log = new Logger('SendModerationFormatModalComponent');


@Component({
  selector: 'app-send-moderation-format-modal',
  templateUrl: './send-moderation-format-modal.component.html',
  styleUrls: ['./send-moderation-format-modal.component.scss'],
  providers: [SendModerationFormatModalService]
})
export class SendModerationFormatModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SendModerationFormatModalComponent>,
    private service: SendModerationFormatModalService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private languageService: LanguageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.createForm();
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
   * Enviar la moderación al correo.
   *
   * @param data
   */
  sendEmail(data: any) {
    this.service.getModeration(data).subscribe(res => {
      let message;
      if (res.status === 200) {
        message = this.languageService.getValue('secure.products.bulk_upload.validation_sent_succesfully');
      } else {
        message = this.languageService.getValue('secure.products.bulk_upload.validation_sent_couldnt_be_sent');
      }
      this.snackBar.open(message, 'Cerrar', {
        duration: 3000
      });
      this.onNoClick();
    });
  }
}
