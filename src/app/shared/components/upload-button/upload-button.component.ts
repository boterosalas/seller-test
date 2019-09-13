import { Component, Input, EventEmitter, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { ACCEPT_TYPE } from '@app/shared/models';
import { UploadButtonService } from './upload-button.service';
import { File, TYPE_VALIDATION, Validation } from './configuration.model';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() accept: Array<ACCEPT_TYPE>;

  @Input() error: Array<Validation>;

  @Input() maxSize: number;

  @Output() fileChange = new EventEmitter<Array<File>>();

  @Output() catchError = new EventEmitter<Array<string>>();

  attachments = new Array<File>();

  isError = false;

  emitingChange(files: Array<File>) {
    this.uploadService
      .base64FromArray(files)
      .pipe(
        map((file: File) => [
          ...this.attachments,
          file
        ]) /* ,
        map(filesB64 => {
          let totalSize = 0;
          filesB64.forEach(file => (totalSize += file.size));
          if (this.maxSize != null && totalSize > this.maxSize) {
            throw new Error(this.error);
          }

          return filesB64;
        }) */
      )
      .subscribe(
        (filesB64: Array<File>) => (this.attachments = filesB64),
        error => {
          this.isError = true;
          this.catchError.emit([error]);
        },
        () => this.fileChange.emit(this.attachments)
      );
  }

  /*   validate(values: Array<File>, validation: Validation): Observable<string> {
    from(values)
    .pipe(

    )

    switch (validation.type) {
      case TYPE_VALIDATION.MAX_SIZE:
        return value.size > this.maxSize ? validation.message : null;
      default:
        return null;
    }
  }
 */
  removeFile(index: number) {
    this.attachments.splice(index - 1, 1);
    this.fileChange.emit(this.attachments);
  }

  constructor(private uploadService: UploadButtonService) {}
}
