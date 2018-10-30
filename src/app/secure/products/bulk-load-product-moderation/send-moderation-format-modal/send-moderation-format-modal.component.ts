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
  ) {}

  ngOnInit() {
    this.createForm();
  }


  onNoClick(): void {
    this.dialogRef.close(false);
  }

  createForm() {
    this.form = this.fb.group({
      'email': [{ value: '' }, [Validators.required, Validators.email]],
    });
  }


  sendEmail() {
    console.log(this.form.value);
  }
}
