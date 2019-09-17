import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  File,
  TYPE_VALIDATION
} from '@app/shared/components/upload-button/configuration.model';
import { from } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import { ACCEPT_TYPE } from '@app/shared/models';

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
    ACCEPT_TYPE.APPLICATION_PDF,
    ACCEPT_TYPE.VIDEO_AVI,
    ACCEPT_TYPE.VIDEO_3GP,
    ACCEPT_TYPE.VIDEO_MOV,
    ACCEPT_TYPE.VIDEO_WMV,
    ACCEPT_TYPE.VIDEO_MPG,
    ACCEPT_TYPE.VIDEO_MPEG,
    ACCEPT_TYPE.VIDEO_MP4
  ];

  validations = [
    {
      type: TYPE_VALIDATION.MAX_SIZE,
      value: 4194304,
      message:
        'El documento adjunto que estas tratando de cargar no es compatible con nuestra plataforma, te pedimos tener en cuenta las siguientes recomendaciones: Tu vídeo no puede durar más de 90 segundos y los formatos permitidos son : AVI, 3GP (móviles), MOV (Mac), WMV (Windows), MPG, MPEG y MP4 con un peso máximo de 4 MB. Las imágenes que puedes cargar deben estar en JPG, PNG o documentos en PDF, Excel o Word'
    },
    {
      type: TYPE_VALIDATION.ACCEPT_TYPES,
      value: [
        ACCEPT_TYPE.APPLICATION_XML,
        ACCEPT_TYPE.IMAGE_PNG,
        ACCEPT_TYPE.IMAGE_JPEG,
        ACCEPT_TYPE.APPLICATION_PDF,
        ACCEPT_TYPE.VIDEO_AVI,
        ACCEPT_TYPE.VIDEO_3GP,
        ACCEPT_TYPE.VIDEO_MOV,
        ACCEPT_TYPE.VIDEO_WMV,
        ACCEPT_TYPE.VIDEO_MPG,
        ACCEPT_TYPE.VIDEO_MPEG,
        ACCEPT_TYPE.VIDEO_MP4
      ],
      message:
        'El documento adjunto que estas tratando de cargar no es compatible con nuestra plataforma, te pedimos tener en cuenta las siguientes recomendaciones: Tu vídeo no puede durar más de 90 segundos y los formatos permitidos son : AVI, 3GP (móviles), MOV (Mac), WMV (Windows), MPG, MPEG y MP4 con un peso máximo de 4 MB. Las imágenes que puedes cargar deben estar en JPG, PNG o documentos en PDF, Excel o Word'
    }
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
