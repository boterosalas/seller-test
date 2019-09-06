import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ACCEPT_TYPE, File } from './configuration.model';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() accept: Array<ACCEPT_TYPE>;
  @Output() fileChange = new EventEmitter<Array<File>>();
}
