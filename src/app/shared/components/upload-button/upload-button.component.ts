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

  @Input() showGeneralError: boolean;

  @Input() generalMessageError: string;

  @Output() fileChange = new EventEmitter<Array<File>>();

  @Output() catchError = new EventEmitter<string>();

  attachments: Array<File>;

  isError: boolean;

  messageError: string;

  maxSizeAllowed: number;

  accept: any;

  emitingChange(files: Array<File>) {
    this.uploadService
      .base64FromArray(files)
      .pipe(
        map((filesB64: File) => {
          const messageError = this.launchValidations([
            ...this.attachments,
            filesB64
          ]);

          if (messageError) {
            throw new Error(messageError);
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
    let messageError = '';

    for (let i = 0; i < attachments.length; i++) {
      const attach = attachments[i];
      const message = this.messageErrorByFile(attach, this.validations);
      if (this.showGeneralError && message.length > 0) {
        return !this.generalMessageError ? `GENERAL_ERROR` : this.generalMessageError;
      } else if (message.length !== 0) {
        messageError += message;
      }
    }

    return messageError === '' ? null : messageError;
  }

  messageErrorByFile(attach: File, validations: Array<Validation>): string {
    let messageError = '';
    for (let i = 0; i < validations.length; i++) {
      const validation = validations[i];
      const message = this.validator(attach, validation);
      messageError += message ? message : '';

    }
    return messageError;
  }

  /**
   * Only can validate 1 file and return the message error for current file
   *
   * @param file
   * @param validation
   */
  validator(file: File, validation: Validation): string {
    switch (validation.type) {
      case TYPE_VALIDATION.MAX_SIZE:
        this.maxSizeAllowed += file.size;
        if (this.maxSizeAllowed > validation.value) {
          this.maxSizeAllowed -= file.size;
          return validation.message;
        }
        break;

      case TYPE_VALIDATION.ACCEPT_TYPES:
        let isValidFormat = false;

        if (validation.value.indexOf(file.type) >= 0) {
          isValidFormat = true;
        }
        if (!isValidFormat) {
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
    this.validations
      .filter(validation => validation.type === TYPE_VALIDATION.ACCEPT_TYPES)
      .forEach(validation => (this.accept = validation.value));
  }

  constructor(private uploadService: UploadButtonService) {
    this.validations = new Array();
    this.attachments = new Array();
    this.isError = false;
    this.maxSizeAllowed = 0;
  }
}
