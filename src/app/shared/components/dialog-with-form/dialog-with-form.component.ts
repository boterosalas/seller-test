import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface DialogData {
  title: string;
  message: string;
  form: FormGroup;
  messageCenter: boolean;
  icon: string;
}

@Component({
  selector: 'app-dialog-with-form',
  templateUrl: './dialog-with-form.component.html',
  styleUrls: ['./dialog-with-form.component.scss']
})
export class DialogWithFormComponent {

  content: TemplateRef<any>;
  valid: boolean = true;


  constructor(
    public dialogRef: MatDialogRef<DialogWithFormComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {

     }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmation: () => void;
}
