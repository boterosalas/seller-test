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
        ACCEPT_TYPE.IMAGE_PNG,
        ACCEPT_TYPE.IMAGE_JPEG,
        ACCEPT_TYPE.APPLICATION_PDF,
        ACCEPT_TYPE.VIDEO_AVI,
        ACCEPT_TYPE.VIDEO_3GP,
        ACCEPT_TYPE.VIDEO_MOV,
        ACCEPT_TYPE.VIDEO_WMV,
        ACCEPT_TYPE.VIDEO_MPG,
        ACCEPT_TYPE.VIDEO_MPEG,
        ACCEPT_TYPE.VIDEO_MP4,
        ACCEPT_TYPE.APPLICATION_DOC,
        ACCEPT_TYPE.APPLICATION_DOCX,
        ACCEPT_TYPE.APPLICATION_DOTX,
        ACCEPT_TYPE.APPLICATION_DOCM,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_XLTX,
        ACCEPT_TYPE.APPLICATION_XLSM,
        ACCEPT_TYPE.APPLICATION_XLTM,
        ACCEPT_TYPE.APPLICATION_XLAM,
        ACCEPT_TYPE.APPLICATION_XLSB,
        ACCEPT_TYPE.APPLICATION_PPT,
        ACCEPT_TYPE.APPLICATION_POTX,
        ACCEPT_TYPE.APPLICATION_PPTX,
        ACCEPT_TYPE.APPLICATION_PPSX,
        ACCEPT_TYPE.APPLICATION_PPAM,
        ACCEPT_TYPE.APPLICATION_PPTM,
        ACCEPT_TYPE.APPLICATION_POTM,
        ACCEPT_TYPE.APPLICATION_PPSM,
        ACCEPT_TYPE.APPLICATION_MDB,
        ACCEPT_TYPE.APPLICATION_PDF,
      ],
      message:
        'El documento adjunto que estas tratando de cargar no es compatible con nuestra plataforma, te pedimos tener en cuenta las siguientes recomendaciones: Tu vídeo no puede durar más de 90 segundos y los formatos permitidos son : AVI, 3GP (móviles), MOV (Mac), WMV (Windows), MPG, MPEG y MP4 con un peso máximo de 4 MB. Las imágenes que puedes cargar deben estar en JPG, PNG o documentos en PDF, Excel o Word'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<ResponseCaseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

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
    this.dialogRef.afterClosed().subscribe(res => { });
  }

  onFileChange(files: Array<File>) {
    from(files)
      .pipe(
        map(
          (file: File): Attachment => {
            return {
              name: file.name,
              type: this.getExtensionName(file),
              base64: file.base64
            };
          }
        ),
        toArray()
      )
      .subscribe(
        (attachments: Array<Attachment>) =>
          (this.response.attachments = attachments)
      );
  }

  getExtensionName(file: File): string {
    const extensionName = file.name.split(/(\.\w+$)/)[1];
    return extensionName.slice(1, extensionName.length);
  }
}

interface Attachment {
  name: String;
  type: String;
  base64: String;
}
