import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-generic',
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss']
})
export class ModalGenericComponent implements OnInit {

  public processFinish$ = new Subject<any>();
  public delete$ = new Subject<any>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalGenericComponent>,
  ) { }

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }

  refresh() {
    this.processFinish$.next(true);
  }
  deleteNotification (){
    this.delete$.next(true);
  }

}
