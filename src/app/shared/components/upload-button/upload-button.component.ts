import { Component, Input, EventEmitter, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { ACCEPT_TYPE } from '@app/shared/models';
import { UploadButtonService } from './upload-button.service';
import { File, TYPE_VALIDATION, Validation } from './configuration.model';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() accept: Array<ACCEPT_TYPE>;

  @Input() validations: Array<Validation>;

  @Output() fileChange = new EventEmitter<Array<File>>();

  @Output() catchError = new EventEmitter<Array<string>>();

  attachments = new Array<File>();

  isError = false;

  messageError: string;

  emitingChange(files: Array<File>) {
    this.uploadService
      .base64FromArray(files)
      .pipe(
        map((file: File) => [...this.attachments, file]),
        map((filesB64: Array<File>) => {
          let errors = null;
          this.validations.forEach(
            (validation: Validation) =>
              (errors = this.validator(filesB64, validation))
          );
          if (errors) {
            throw new Error(errors.toString());
          }
          return filesB64;
        })
      )
      .subscribe(
        (filesB64: Array<File>) => (this.attachments = filesB64),
        error => {
          this.isError = true;
          this.messageError = error;
          this.catchError.emit(error);
        },
        () => this.fileChange.emit(this.attachments)
      );
  }

  validator(values: Array<File>, validation: Validation): Array<string> {
    let totalSize = 0;
    const errors = Array<string>();
    values.forEach((file: File) => {
      switch (validation.type) {
        case TYPE_VALIDATION.MAX_SIZE:
          totalSize += file.size;
          if (totalSize > validation.value) {
            errors.push(validation.message);
          }
          break;
      }
    });
    return errors.length > 0 ? errors : null;
  }

  removeFile(index: number) {
    this.attachments.splice(index - 1, 1);
    this.isError = false;
    this.fileChange.emit(this.attachments);
  }

  constructor(private uploadService: UploadButtonService) {}
}
