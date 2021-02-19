import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LoadingService } from '@app/core';
import { ShellComponent } from '@app/core/shell';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SellerService } from '../../seller.service';
import { HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-modal-bulkload-agreement',
  templateUrl: './modal-bulkload-agreement.component.html',
  styleUrls: ['./modal-bulkload-agreement.component.scss']
})
export class ModalBulkloadAgreementComponent implements OnInit {
  
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
    public dialogRef: MatDialogRef<ModalBulkloadAgreementComponent>,
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
  }

  /**
   * Metodo para crear formulario
   * @memberof ModalBulkloadAgreementComponent
   */
  createForm() {
    this.form = new FormGroup({
      typeAgreement: new FormControl('', Validators.compose([Validators.required])),
      description: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  /**
   * Funcion para cerrar modal
   * @memberof ModalBulkloadAgreementComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

}
