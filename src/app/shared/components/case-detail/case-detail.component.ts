import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ProductsCaseDialogComponent } from "../products-case-dialog/products-case-dialog.component";
import { ResponseCaseDialogComponent } from "../response-case-dialog/response-case-dialog.component";

@Component({
  selector: "app-case-detail",
  templateUrl: "./case-detail.component.html",
  styleUrls: ["./case-detail.component.scss"]
})
export class CaseDetailComponent implements OnInit {
  configDialog = {
    width: "50%",
    height: "fit-content",
    data: { title: "texts" }
  };

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openResponseDialog(): void {
    const dialogRef = this.dialog.open(
      ResponseCaseDialogComponent,
      this.configDialog
    );
    dialogRef.afterClosed().subscribe(result => console.log("are Closed"));
  }

  openProductsDialog(): void {
    const dialogRef = this.dialog.open(
      ProductsCaseDialogComponent,
      this.configDialog
    );
    dialogRef.afterClosed().subscribe(result => console.log("are Closed"));
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
