import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SendModerationFormatModalComponent } from '@secure/products/bulk-load-product-moderation/send-moderation-format-modal/send-moderation-format-modal.component';
import { ConfigBulkLoad, Event, TypeEvents } from '@shared/components/bulk-load';

@Component({
  selector: 'app-bulk-load-product-moderation',
  templateUrl: './bulk-load-product-moderation.component.html',
  styleUrls: ['./bulk-load-product-moderation.component.scss']
})
export class BulkLoadProductModerationComponent implements OnInit, AfterViewInit {
  // Plantilla para configurar el contenido principal del componente 'bulk-load'.
  @ViewChild('mainContentTpl') private mainContentTpl: TemplateRef<any>;
  // Configuración del componente 'bulk-load'.
  config: Partial<ConfigBulkLoad> = {
    title: 'VALIDACIÓN DE PRODUCTOS'
  };
  // Referencia de la modal
  dialogRef: MatDialogRef<SendModerationFormatModalComponent>;

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config.mainContentTpl = this.mainContentTpl;
  }

  /**
   * Abre una modal y solicita el correo al cual se va enviar la moderación.
   */
  requestMail() {
    this.dialogRef = this.dialog.open(SendModerationFormatModalComponent);
  }

  /**
   * Controla los eventos que ocurren en el componente 'bulk-load'.
   *
   * @param {Event} e
   */
  manageEvents(e: Event) {
    // Descargar formato
    if (e.type === TypeEvents.download) {
      this.requestMail();
    }
  }

}
