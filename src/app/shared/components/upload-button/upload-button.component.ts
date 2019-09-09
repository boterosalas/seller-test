import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ACCEPT_TYPE, File } from './configuration.model';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent {
  @Input() accept: Array<ACCEPT_TYPE>;
  @Output() fileChange = new EventEmitter<Array<File>>();

  emitingChange(files: Array<File>) {
    this.parseFilesToBase64(Array.from(files)).then(s =>
      this.fileChange.emit(s)
    );
  }

  /**
   * Transformación en base 64
   *
   * @param {File[]} files
   * @returns {Subscription}
   * @memberof LoadFileComponent
   */
  public async parseFilesToBase64(files: Array<File>): Promise<Array<File>> {
    const convertedFiles = new Array<File>();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base = await this.getBase64(file);
      const fileWithBase64 = Object.assign(file, { base64: base });
      convertedFiles.push(fileWithBase64);
    }

    return convertedFiles;
  }

  public getBase64(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
