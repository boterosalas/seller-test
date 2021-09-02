import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-advertisements',
  templateUrl: './modal-advertisements.component.html',
  styleUrls: ['./modal-advertisements.component.scss']
})
export class ModalAdvertisementsComponent implements OnInit {
  body: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalAdvertisementsComponent>,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.setBody();
  }

  /**
   * Seteo parametros al body con estilos
   */
  setBody() {
    if (this.data && this.data.Body) {
      this.body = this.data.Body ? this.sanitizer.bypassSecurityTrustHtml(this.data.Body) : null;
    }
  }


  /**
   * Cierra el modal
   */
  public close(): void {
    this.dialogRef.close();
  }

}
