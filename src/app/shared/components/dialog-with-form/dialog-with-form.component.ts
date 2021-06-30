import { Component, OnInit, Inject, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';

interface DialogData {
  msjDeleteCategory: Boolean;
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
export class DialogWithFormComponent implements OnInit {

  content: TemplateRef<any>;
  msjDeleteCategory: Boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DialogWithFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {

  }

  ngOnInit() {
    console.log("FORMMMM",this.data, this.content);
  }

  onNoClick: () => void = () => {
    // tslint:disable-next-line:no-unused-expression
    /* !!this.data && !!this.data.form && this.data.form.reset();
    this.dialogRef.close(); */
    console.log(this.content);

  }

  // tslint:disable-next-line:member-ordering
  confirmation: () => void;
}
