import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-preview-notification',
  templateUrl: './modal-preview-notification.component.html',
  styleUrls: ['./modal-preview-notification.component.scss']
})
export class ModalPreviewNotificationComponent implements OnInit {

  public title = null;
  public typeBody = null;
  public imagePathDrag = null;
  public body = null;
  public backgroundColor = null;
  public link = null;
  public showBtn = null;
  public btnTitle = null;
  public processFinishModalPreview$ = new Subject<any>();
  public load = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ModalPreviewNotificationComponent>,
  ) { }

  ngOnInit() {
    if (this.data) {
      this.title = this.data.Title ? this.data.Title.charAt(0).toUpperCase() + this.data.Title.slice(1) : null;
      this.typeBody = this.data.NewsContentType ? this.data.NewsContentType.toString() : null;
      this.imagePathDrag = this.data.UrlImage ? this.data.UrlImage : null;
      this.body = this.data.Body ? this.sanitizer.bypassSecurityTrustHtml(this.data.Body) : null;
      this.backgroundColor = this.data.BackgroundColor ? this.data.BackgroundColor : null;
      this.link = this.data.Link ? this.data.Link : null;
      this.showBtn = this.data.showPreview ? this.data.showPreview : null;
      this.btnTitle = this.data.btnTitle ? this.data.btnTitle : 'Crear anuncio';
    }
    setTimeout(() => {
      this.load = false;
    }, 700);
  }

  close() {
    this.dialogRef.close();
  }

  callToAction() {
    if (this.link) {
      window.open(this.link, '_blank');
    }
  }

  emitEventNotification() {
    this.processFinishModalPreview$.next();
  }

}
