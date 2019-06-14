import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {

  constructor(public dialog: MatDialog) {
   }

  ngOnInit() {
  }

  openDialog(): void{
    const dialogRef = this.dialog.open(TicketModalComponent,{
      width: '760px',
      height: '482px',
      data: {title: 'texts'}
    });
    dialogRef.afterClosed().subscribe(result => console.log('are Closed'));
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

}
