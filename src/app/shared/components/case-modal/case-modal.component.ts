import { Component, OnInit, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-case-modal",
  templateUrl: "./case-modal.component.html",
  styleUrls: ["./case-modal.component.scss"]
})
export class CaseModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CaseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
  closeDialog(): void {
    this.dialogRef.close();
  }
}
