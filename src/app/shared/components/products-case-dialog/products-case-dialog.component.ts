import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-products-case-dialog",
  templateUrl: "./products-case-dialog.component.html",
  styleUrls: ["./products-case-dialog.component.scss"]
})
export class ProductsCaseDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ProductsCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
  closeDialog(): void {
    this.dialogRef.close();
  }
}
