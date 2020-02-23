import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export enum quotiongDialogAction {
  add,
  update,
  delete
}

@Component({
  selector: 'app-modal-quoting-seller',
  templateUrl: './modal-quoting-seller.component.html',
  styleUrls: ['./modal-quoting-seller.component.scss']
})

export class ModalQuotingSellerComponent implements OnInit {

  action: any;
  actions = quotiongDialogAction;
  constructor(
    public dialogRef: MatDialogRef<ModalQuotingSellerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data, this.actions);
      this.action = data ? data.action : null;
    }

  ngOnInit() {
  }

}