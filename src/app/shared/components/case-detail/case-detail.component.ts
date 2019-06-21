import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ProductsCaseDialogComponent } from "../products-case-dialog/products-case-dialog.component";
import { ResponseCaseDialogComponent } from "../response-case-dialog/response-case-dialog.component";
const productsConfig = require("./products-list-configuration.json");

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

  products = [
    {
      name: "Producto 1",
      price: "$20.000"
    },
    {
      name: "Producto 2",
      price: "$20.000"
    }
  ];

  productsConfig: Array<any>;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.productsConfig = productsConfig;
  }

  openResponseDialog(): void {
    const dialogRef = this.dialog.open(
      ResponseCaseDialogComponent,
      this.configDialog
    );
    dialogRef.afterClosed().subscribe(result => console.log("are Closed"));
  }

  onClickShowAllProducts() {
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
