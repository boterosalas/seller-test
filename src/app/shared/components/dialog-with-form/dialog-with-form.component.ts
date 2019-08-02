import { Component, OnInit, Inject, TemplateRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

interface DialogData {
  title: string;
  message: string;
  form: FormGroup;
  messageCenter: boolean;
  icon: string;
  showButtons: boolean;
  btnConfirmationText: string;
  validation?: BehaviorSubject<boolean>;
}

@Component({
  selector: 'app-dialog-with-form',
  templateUrl: './dialog-with-form.component.html',
  styleUrls: ['./dialog-with-form.component.scss']
})
export class DialogWithFormComponent implements OnInit{

  onNoClick$ = new BehaviorSubject(null);
  content: TemplateRef<any>;
  validation;

  constructor(
    public dialogRef: MatDialogRef<DialogWithFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {

     }

     ngOnInit() {
     }

  onNoClick:() => void = () => {
    !!this.data && !!this.data.form && this.data.form.reset();
    this.dialogRef.close();
    this.onNoClick$.next(true);
  }

  confirmation: () => void;
}
