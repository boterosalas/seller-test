import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Logger } from '@app/core';

import { SendModerationFormatModalService } from './send-moderation-format-modal.service';


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
    this.service.sendModeration(data).subscribe(res => {
      this.onNoClick();
    });
  }
}
