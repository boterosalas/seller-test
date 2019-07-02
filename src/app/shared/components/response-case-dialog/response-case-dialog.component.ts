import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-case-modal",
  templateUrl: "./response-case-dialog.component.html",
  styleUrls: ["./response-case-dialog.component.scss"]
})
export class ResponseCaseDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ResponseCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}
  closeDialog(): void {
    this.dialogRef.close();
  }
  submitResponse(){
    console.log(this.data);
    this.dialogRef.close({data: this.data});
    this.dialogRef.afterClosed().subscribe(res => {this.data.Id = '', this.data.Description = ''});
  }
}
