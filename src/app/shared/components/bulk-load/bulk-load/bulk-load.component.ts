import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Logger } from '@app/core';
import { ConfigBulkLoad, Event, TypeEvents } from '../models/bulk-load.model';

const log = new Logger('BulkLoadComponent(shared)');

@Component({
  selector: 'app-bulk-load',
  templateUrl: './bulk-load.component.html',
  styleUrls: ['./bulk-load.component.scss'],
})
export class BulkLoadComponent implements OnInit {
  @Input() config: ConfigBulkLoad = {
    title: 'CARGA MASIVA',
    mainContentTpl: null
  };
  @ViewChild('fileUploadInput') fileUploadInput: ElementRef;
  @Output() event: EventEmitter<Event> = new EventEmitter();

  ngOnInit(): void {
  }

  /**
   * Emite un evento cuando se quiere descargar el formato.
   */
  downloadFile() {
    this.event.emit({
      type: TypeEvents.download
    });
  }

  /**
   * Emite un evento cuando se quiere importar el formato.
   */
  uploadFile() {
    this.event.emit({
      type: TypeEvents.upload
    });
    log.debug('importFile');
  }

  /**
   * Cuando cambia el input tupo file.
   *
   * @param e
   */
  fileUploadInputChanged(e: any) {
    log.debug('fileUploadInputChanged');
  }

  /**
   * Simula el evento click del input tipo file.
   */
  fileUploadInputClick() {
    const el: HTMLElement = this.fileUploadInput.nativeElement as HTMLElement;
    el.click();
  }

}
