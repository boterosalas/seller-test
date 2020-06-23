import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpEvent } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Logger, LoadingService } from '@app/core';
import { SellerService } from '../seller.service';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService } from '@app/shared';
const log = new Logger('LoadFileComponent');

@Component({
  selector: 'app-modal-load-agreement',
  templateUrl: './modal-load-agreement.component.html',
  styleUrls: ['./modal-load-agreement.component.scss']
})
export class ModalLoadAgreementComponent implements OnInit {

  public form: FormGroup;
  public uploadAgreementBtn = true;
  public clearTable = new EventEmitter<any>();

  accept = '*';
  files: File[] = [];
  progress: number;
  hasBaseDropZoneOver = false;
  httpEmitter: Subscription;
  httpEvent: HttpEvent<Event>;
  lastFileAt: Date;
  maxSize = 3145728;
  lastInvalids: any;
  dataToSend: any;
  showProgress = false;
  validComboDrag = true;
  dragFiles = true;
  file = null;
  arraySend = [];

  constructor(
    public dialogRef: MatDialogRef<ModalLoadAgreementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
    public componentService: ComponentsService,
    private languageService: TranslateService,
    private sellerService: SellerService,
    private shellComponent: ShellComponent,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.createForm();
    this.createArraySend();
  }

  createForm() {
    this.form = new FormGroup({
      typeAgreement: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required])),
    });
  }
  /**
   * funcion para crear el array que se envia al servicio
   * si all es true entonces los deseleccionados (arrayNotSelect) se mandan, si all (arraySelect) es false este se manda
   * @memberof ModalLoadAgreementComponent
   */
  createArraySend() {
    if (this.data) {
      if (this.data.selectAll === true) {
        this.data.arrayNotSelect.forEach(element => {
          this.arraySend.push(element.IdSeller);
        });
      } else {
        this.data.arraySelect.forEach(element => {
          this.arraySend.push(element.IdSeller);
        });
      }
    }
  }

  /**
   * Método para cerrar el modal
   * @memberof FinishUploadProductInformationComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }
  /**
   * funcion para transformar el PDF en formato 64 y enviar los datos al servidor
   *
   * @memberof ModalLoadAgreementComponent
   */
  sendImportAgreement() {
    this.loadingService.viewSpinner();
    const lengthFiles = document.getElementById('pdf').getElementsByTagName('input')[0].files.length;
    let file = document.getElementById('pdf').getElementsByTagName('input')[0].files[lengthFiles - 1];
    if (!file) {
      file = this.files[this.files.length - 1];
    }
    this.getBase64(file).then(data => {
      try {
        const bodyToSend = {
          fileAgreement: data.slice(data.search('base64') + 7, data.length),
          typeContracts: this.form.controls.typeAgreement.value,
          name: this.form.controls.description.value,
          sellers: this.arraySend,
          applyAllSeller: this.data.selectAll
        };
        this.sellerService.registersContract(bodyToSend).subscribe((result: any) => {
          this.loadingService.closeSpinner();
          if (result.statusCode === 200) {
            const dataRes = JSON.parse(result.body).Data;
            if (dataRes) {
              this.componentService.openSnackBar(this.languageService.instant('secure.load_guide_page.finish_upload_info.title'), this.languageService.instant('actions.close'), 5000);
              this.dialogRef.close(false);
              this.shellComponent.eventEmitterOrders.getClear();
            } else {
              this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.close'), 5000);
            }
          } else {
            this.componentService.openSnackBar(this.languageService.instant('secure.products.bulk_upload.error_has_uploading'), this.languageService.instant('actions.close'), 5000);
          }
        });
      } catch (e) {
        log.error(this.languageService.instant('shared.components.load_file.snackbar_error'), e);
      }
    });

  }
  /**
   * funcion para pasar a 64 el archivo PDF y poder enviarlo al servicio
   *
   * @param {*} file
   * @returns {*}
   * @memberof ModalLoadAgreementComponent
   */
  public getBase64(file: any): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
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
   * funcion para validar el boton de enviar acuerdos
   *
   * @memberof ModalLoadAgreementComponent
   */
  validateOneFile() {
    this.uploadAgreementBtn = false;
  }
  /**
   * funcion para validar el boton de enviar acuerdos
   *
   * @param {*} validate
   * @memberof ModalLoadAgreementComponent
   */
  validateFormatInvalidate(validate: any) {
    this.uploadAgreementBtn = true;
  }
}
