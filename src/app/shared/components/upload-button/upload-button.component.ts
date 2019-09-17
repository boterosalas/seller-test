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

  totalSize = 0;

  emitingChange(files: Array<File>) {
    this.uploadService
      .base64FromArray(files)
      .pipe(
        map((filesB64: File) => {
          const errors = this.launchValidations([
            ...this.attachments,
            filesB64
          ]);
          if (errors) {
            throw new Error(errors);
          }
          return filesB64;
        })
      )
      .subscribe(
        (fileB64: File) => (this.attachments = [...this.attachments, fileB64]),
        error => {
          this.isError = true;
          this.messageError = error;
          this.catchError.emit(error);
        },
        () => {
          this.fileChange.emit(this.attachments);
        }
      );
  }

  launchValidations(attachments: Array<File>): string {
    let errors = '';

    attachments.forEach((attach: File) => {
      this.validations.forEach((validation: Validation) => {
        const message = this.validator(attach, validation);
        errors += message ? message : '';
      });
    });
    return errors === '' ? null : errors;
  }

  validator(file: File, validation: Validation): string {
    switch (validation.type) {
      case TYPE_VALIDATION.MAX_SIZE:
        this.totalSize += file.size;
        if (this.totalSize > validation.value) {
          return validation.message;
        }
        break;

      case TYPE_VALIDATION.ACCEPT_TYPES:
        let formatAccept = false;

        if (validation.value.indexOf(file.type) > 0) {
          formatAccept = true;
        }
        if (!formatAccept) {
          return validation.message;
        }
        break;
    }

    return null;
  }

  removeFile(index: number) {
    this.attachments.splice(index - 1, 1);
    this.isError = false;
    this.fileChange.emit(this.attachments);
  }

  constructor(private uploadService: UploadButtonService) {}
}
