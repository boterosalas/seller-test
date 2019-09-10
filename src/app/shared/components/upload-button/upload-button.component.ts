import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ACCEPT_TYPE, File } from './configuration.model';
import { UploadButtonService } from './upload-button.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() accept: Array<ACCEPT_TYPE>;

  @Output() fileChange = new EventEmitter<Array<File>>();

  attachments = new Array<File>();

  emitingChange(files: Array<File>) {
    this.uploadService
      .base64FromArray(files)
      .pipe(map((file: File) => [...this.attachments, file]))
      .subscribe(
        (filesB64: Array<File>) => (this.attachments = filesB64),
        error => console.log(error),
        () => this.fileChange.emit(this.attachments)
      );
  }

  removeFile(index: number) {
    this.attachments.splice(index - 1, 1);
    this.fileChange.emit(this.attachments);
  }

  constructor(private uploadService: UploadButtonService) {}
}
