import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { UploadButtonService } from './upload-button.service';
import { File, TYPE_VALIDATION, Validation } from './configuration.model';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
  @Input() validations: Array<Validation>;

  @Output() fileChange = new EventEmitter<Array<File>>();

  @Output() catchError = new EventEmitter<string>();

  attachments = new Array<File>();

  isError = false;

  messageError: string;

  totalSize = 0;

  accept: any;

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
        (fileB64: File) => {
          this.isError = false;
          this.attachments = [...this.attachments, fileB64];
        },
        (error: string) => {
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
          this.totalSize -= file.size;
          return validation.message;
        }
        break;

      case TYPE_VALIDATION.ACCEPT_TYPES:
        let formatAccept = false;

        if (validation.value.indexOf(file.type) >= 0) {
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

  ngOnInit() {
    const acceptValidations = this.validations.filter(
      validation => validation.type === TYPE_VALIDATION.ACCEPT_TYPES
    );
    this.accept = acceptValidations[0].value;
  }

  constructor(private uploadService: UploadButtonService) {}
}
