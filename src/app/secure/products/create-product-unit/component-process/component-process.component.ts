import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { ProcessService } from './component-process.service';
import { SaveProcessDialogComponent } from './dialogSave/dialogSave.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '@app/core/global/loading/loading.service';

@Component({
  selector: 'app-component-process',
  templateUrl: './component-process.component.html',
  styleUrls: ['./component-process.component.scss']
})
export class ComponentProcessComponent implements OnInit {
  isLinear = false;
  /* eanCtrl: FormGroup;
  categoryCtrl: FormGroup;
  basicInfoCtrl: FormGroup;
  especificCtrl: FormGroup;
  imageCtrl: FormGroup; */
  eanFormGroup: FormGroup;
  categoryFormGroup: FormGroup;
  basicInfoFormGroup: FormGroup;
  especificFormGroup: FormGroup;
  imageFormGroup: FormGroup;
  options: FormGroup;
  isOptional = false;
  views: any;
  children_created: any = 0;
  modalService: any;

  constructor(private fb: FormBuilder,
    private loadingService: LoadingService,
    private process: ProcessService,
    public dialog: MatDialog) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.eanFormGroup = this.fb.group({
      eanCtrl: ['', Validators.required]
    });
    this.categoryFormGroup = this.fb.group({
      categoryCtrl: ['', Validators.required]
    });
    this.basicInfoFormGroup = this.fb.group({
      basicInfoCtrl: ['', Validators.required]
    });
    this.especificFormGroup = this.fb.group({
      especificCtrl: ['1', Validators.required]
    });
    this.imageFormGroup = this.fb.group({
      imageCtrl: ['', Validators.required]
    });
    this.process.change.subscribe(data => {
      this.views = data;
      this.validateView();
    });
  }

  public continue_after_basic_info() {
    if (this.process.getProductData().Children) {
    this.children_created = this.process.getProductData().Children.length;
    }
  }


  public validateView(): void {
    if (this.views.showEan) {
      this.eanFormGroup.controls.eanCtrl.setValue('1');
    } else if (!this.views.showEan) {
      this.eanFormGroup.controls.eanCtrl.setValue(null);
    }
    if (this.views.showCat) {
      this.categoryFormGroup.controls.categoryCtrl.setValue('1');
    }
    if (this.views.showInfo) {
      this.basicInfoFormGroup.controls.basicInfoCtrl.setValue('1');
    } else if (!this.views.showInfo) {
      this.basicInfoFormGroup.controls.basicInfoCtrl.setValue(null);
    }
    if (this.views.showImg) {
      this.imageFormGroup.controls.imageCtrl.setValue('1');
    } else if (!this.views.showImg) {
      this.imageFormGroup.controls.imageCtrl.setValue(null);
    }

  }

  /**
   * Funtion saveInformationCreation()
   * Funcion para guardar la información de la creación unitaria.
   * @memberof ComponentProcessComponent
   */
  saveInformationCreation() {
    this.loadingService.viewSpinner();
    // call to the bulk load product service
    this.process.saveInformationUnitreation().subscribe(result => {
      const data = result;
      if (data['data'] !== null && data['data'] !== undefined) {
        this.openDialogSendOrder2(data);
      } else {
        this.modalService.showModal('errorService');
      }

    });
    this.loadingService.closeSpinner();
  }

  /**
   * Funcion: openDialogSendOrder2
   * Funcion para desplegar el modal de exitoso o con los errores del guardado de la creacion unitaria.
   * @param {*} res
   * @memberof ComponentProcessComponent
   */
  openDialogSendOrder2(res: any): void {
    if (!res.data) {
      res.productNotifyViewModel = res.data.productNotify;
    } else {
      // Condicional apra mostrar errores mas profundos. ;
      if (res.data) {
        res.productNotifyViewModel = res.data.productNotify;
      }
    }
    const dialogRef = this.dialog.open(SaveProcessDialogComponent, {
      width: '95%',
      disableClose: true,
      data: {
        response: res
      },
    });
    dialogRef.afterClosed().subscribe(resdialog => {
    });
  }
}

