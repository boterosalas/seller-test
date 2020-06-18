import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpEvent } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from '@app/core';
import { SellerService } from '../seller.service';
import { ShellComponent } from '@app/core/shell';
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
    private languageService: TranslateService,
    private sellerService: SellerService,
    private shellComponent: ShellComponent,
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

  createArraySend() {
    if (this.data) {
      if (this.data.selectAll === true) {
        this.arraySend = this.data.arrayNotSelect;
      } else {
        this.arraySend = this.data.arraySelect;
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

  sendImportAgreement() {
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
        this.sellerService.appplyAgreement(bodyToSend).subscribe((result: any) => {
          this.shellComponent.eventEmitterOrders.getClear();

        });
      } catch (e) {
        log.error(this.languageService.instant('shared.components.load_file.snackbar_error'), e);
      }
    });

  }

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

  validateOneFile() {
    this.uploadAgreementBtn = false;
  }

  validateFormatInvalidate(validate: any) {
    this.uploadAgreementBtn = true;
  }
}
