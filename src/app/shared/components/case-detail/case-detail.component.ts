import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CaseModalComponent } from "../case-modal/case-modal.component";

@Component({
  selector: "app-case-detail",
  templateUrl: "./case-detail.component.html",
  styleUrls: ["./case-detail.component.scss"]
})
export class CaseDetailComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CaseModalComponent, {
      width: "760px",
      height: "482px",
      data: { title: "texts" }
    });
    dialogRef.afterClosed().subscribe(result => console.log("are Closed"));
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
