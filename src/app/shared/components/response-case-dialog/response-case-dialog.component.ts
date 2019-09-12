import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  ACCEPT_TYPE,
  File
} from '@app/shared/components/upload-button/configuration.model';
import { from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-case-modal',
  templateUrl: './response-case-dialog.component.html',
  styleUrls: ['./response-case-dialog.component.scss']
})
export class ResponseCaseDialogComponent {
  response = {
    id: null,
    description: null,
    attachments: new Array<Attachment>()
  };

  accepts = [
    ACCEPT_TYPE.APPLICATION_XML,
    ACCEPT_TYPE.IMAGE_PNG,
    ACCEPT_TYPE.IMAGE_JPEG,
    ACCEPT_TYPE.PDF,
    ACCEPT_TYPE.VIDEO_AVI,
    ACCEPT_TYPE.VIDEO_3GP,
    ACCEPT_TYPE.VIDEO_MOV,
    ACCEPT_TYPE.VIDEO_WMV,
    ACCEPT_TYPE.VIDEO_MPG,
    ACCEPT_TYPE.VIDEO_MPEG,
    ACCEPT_TYPE.VIDEO_MP4
  ];

  constructor(
    public dialogRef: MatDialogRef<ResponseCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitResponse() {
    this.dialogRef.close({
      data: {
        ...this.response,
        id: this.data.id
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {});
  }

  onFileChange(files: Array<File>) {
    from(files)
      .pipe(
        map(
          (file: File): Attachment => ({
            name: file.name,
            type: file.type,
            base64: file.base64
          })
        ),
        toArray()
      )
      .subscribe(
        (attachments: Array<Attachment>) =>
          (this.response.attachments = attachments)
      );
  }
}

interface Attachment {
  name: String;
  type: String;
  base64: String;
}
