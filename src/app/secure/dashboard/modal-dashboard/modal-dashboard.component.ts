import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-dashboard',
  templateUrl: './modal-dashboard.component.html',
  styleUrls: ['./modal-dashboard.component.scss']
})
export class ModalDashboardComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalDashboardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  onNoClick: () => void = () => {
    this.dialogRef.close();
  }

}
