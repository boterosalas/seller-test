import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { ResponseCaseDialogComponent } from "../response-case-dialog/response-case-dialog.component";

@Component({
  selector: "app-case-detail",
  templateUrl: "./case-detail.component.html",
  styleUrls: ["./case-detail.component.scss"]
})
export class CaseDetailComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ResponseCaseDialogComponent, {
      width: "50%",
      height: "fit-content",
      data: { title: "texts" }
    });
    dialogRef.afterClosed().subscribe(result => console.log("are Closed"));
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
