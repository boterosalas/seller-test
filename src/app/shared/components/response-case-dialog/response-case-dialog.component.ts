import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  ACCEPT_TYPE,
  File
} from '@app/shared/components/upload-button/configuration.model';

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

  attachments: Array<Attachment>;

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
  ) {
    this.attachments = new Array<Attachment>();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  submitResponse() {
    this.response.id = this.data.id;
    this.dialogRef.close({ data: this.response });
    this.dialogRef.afterClosed().subscribe(res => {});
  }

  onFileChange(event: Array<File>) {
    const filesSelected = event.map(
      (att: File): Attachment => ({
        name: att.name,
        type: att.type,
        base64: att.base64
      })
    );
    this.attachments = this.attachments.concat(filesSelected);
  }
}

interface Attachment {
  name: String;
  type: String;
  base64: String;
}
