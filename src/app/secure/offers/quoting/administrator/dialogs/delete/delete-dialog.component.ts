import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ListTransporterService } from '../../list-transporter/list-transporter.service';
import { ListZonesService } from '../../list-zones/list-zones.service';

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.component.html',
  styleUrls: ['./../dialog.component.scss']
})
export class DeleteDialogComponent implements OnInit {

  public typeDeleteTransport: number;
  public typeDeleteZone: number;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    private transportService: ListTransporterService,
    private zonesTransport: ListZonesService,
    @Inject(MAT_DIALOG_DATA) public typeDeleteDialog: number) { }

  ngOnInit() {
    this.typeDeleteTransport = this.transportService.getDialogType();
    this.typeDeleteZone = this.zonesTransport.getDialogType();
  }

  /**
   * Close dialog and if confirm send to another component this answer
   *
   * @param {boolean} confirm
   * @memberof DeleteDialogComponent
   */
  closeDialog(confirm: boolean): void {
    this.dialogRef.close(confirm);
  }


}

