import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ComponentsService } from "@app/shared";

@Component({
  selector: "app-upload-file",
  templateUrl: "./upload-file.component.html",
  styleUrls: ["./upload-file.component.scss"],
})
export class UploadFileComponent implements OnInit {
  accept = "*";
  @Input() files: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  lastFileAt: Date;
  maxSize = 7145728;
  lastInvalids: any;
  dataToSend: any;
  showProgress = false;
  validComboDrag = true;
  dragFiles = true;
  file = null;
  @Output() sendFileEvent = new EventEmitter<any>();
  @Output() validateOneFileEvent = new EventEmitter<any>();
  @Input() manualName: String;
  @Input() id: String;

  

  constructor(public componentService: ComponentsService) {}

  ngOnInit() {}

  /**
   * funcion para transformar el PDF en formato 64 
   *
   * @memberof UploadFileComponent
   */
  sendFile() {
    const lengthFiles = document
      .getElementById(`${this.id}`)
      .getElementsByTagName("input")[0].files.length;
    let file = document.getElementById(`${this.id}`).getElementsByTagName("input")[0]
      .files[lengthFiles - 1];
      file = this.files[this.files.length - 1];
    this.getBase64(file).then((dataFile) => {
      let splitb64File = dataFile.split('data:application/pdf;base64,');
      let data = splitb64File[1];
      this.sendFileEvent.emit({data});
    });
  }
  /**
   * funcion para pasar a 64 el archivo PDF 
   *
   * @param {*} file
   * @returns {*}
   * @memberof ModalLoadAgreementComponent
   */
  public getBase64(file: any): any {
    console.log(file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  /**
   * Obitene la fecha actual
   *
   * @returns
   * @memberof LoadFileComponent
   */
  public getDate(): Date {
    return new Date();
  }

  /**
   * funcion para validar el boton de guardar
   *
   * @memberof UploadFileComponent
   */
  validateOneFile() {
    this.validateOneFileEvent.emit(false);
  }
  /**
   * funcion para validar el boton de guardar
   *
   * @param {*} validate
   * @memberof UploadFileComponent
   */
  validateFormatInvalidate(validate: any) {
    this.validateOneFileEvent.emit(true);
  }

}
