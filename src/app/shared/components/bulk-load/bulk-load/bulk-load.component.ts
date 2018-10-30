import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';

import { Logger } from '@app/core';

import { ConfigBulkLoad, Event, TypeEvents } from '../models/bulk-load.model';

// log component
const log = new Logger('BulkLoadComponent(shared)');

@Component({
  selector: 'app-bulk-load',
  templateUrl: './bulk-load.component.html',
  styleUrls: ['./bulk-load.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('*', style({ height: '*', visibility: 'visible' })),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class BulkLoadComponent implements OnInit {
  @Input() config: ConfigBulkLoad = {
    title: 'CARGA MASIVA',
    mainContentTpl: null
  };
  @ViewChild('fileUploadInput') fileUploadInput: ElementRef;

  private event: EventEmitter<Event> = new EventEmitter();

  ngOnInit(): void {
  }

 downloadFile() {
  this.event.emit({
    type: TypeEvents.download
  });
  console.log('exportFile');
 }

 uploadFile() {
  this.event.emit({
    type: TypeEvents.upload
  });
  console.log('importFile');
 }

 fileUploadInputChanged(e: any) {
  console.log('fileUploadInputChanged');
 }

  fileUploadInputClick() {
    const el: HTMLElement = this.fileUploadInput.nativeElement as HTMLElement;
    el.click();
  }

}
