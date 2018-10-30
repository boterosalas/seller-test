import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@root/node_modules/@angular/material';
import { FinishUploadInformationComponent } from '@secure/offers/bulk-load/finish-upload-information/finish-upload-information.component';
import { SendModerationFormatModalComponent } from '@secure/products/bulk-load-product-moderation/send-moderation-format-modal/send-moderation-format-modal.component';
import { ConfigBulkLoad } from '@shared/components/bulk-load/models/bulk-load.model';

@Component({
  selector: 'app-bulk-load-product-moderation',
  templateUrl: './bulk-load-product-moderation.component.html',
  styleUrls: ['./bulk-load-product-moderation.component.scss']
})
export class BulkLoadProductModerationComponent implements OnInit, AfterViewInit {
  @ViewChild('mainContentTpl') private mainContentTpl: TemplateRef<any>;

  config: Partial<ConfigBulkLoad> = {
    title: 'VALIDACIÓN DE PRODUCTOS'
  };

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config.mainContentTpl = this.mainContentTpl;
  }

  requestMail() {
    const dialogRef = this.dialog.open(SendModerationFormatModalComponent);
  }

}
