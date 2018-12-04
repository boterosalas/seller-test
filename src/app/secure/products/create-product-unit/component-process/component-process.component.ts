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
    this.children_created = this.process.getProductData().Children.length;
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

  /*
  public saveInformationCreation(res: any): void {
    // this.loadingService.viewSpinner();
    this.process.saveInformationUnitreation().subscribe(result => {
      const data = result;
      console.log('data:', data);
      const dialogRef = this.dialog.open(SaveProcessDialogComponent, {
        width: '800px',
        disableClose: true,
        data: {
          response: data
        },
      });
       dialogRef.afterClosed().subscribe(resdialog => {
        console.log('The dialog was closed');
      });
    });
  } */
  // //

  saveInformationCreation() {
    this.loadingService.viewSpinner();
    // call to the bulk load product service
    this.process.saveInformationUnitreation().subscribe(result => {
      const data = result;
      console.log('data:', data);
      if (data['data'] !== null && data['data'] !== undefined) {
        console.log('entra aqui');
        console.log('data-data: ', data['data']);
        this.openDialogSendOrder2(data);
      } else {
        this.modalService.showModal('errorService');
      }

    });
    this.loadingService.closeSpinner();
  }

  openDialogSendOrder2(res: any): void {
    console.log('res: ', res);
    if (!res.data) {
      res.productNotifyViewModel = res.data.productNotify;
      console.log('diferente de data dentro modal; ', res.productNotifyViewModel);
    } else {
      // Condicional apra mostrar errores mas profundos. ;
      if (res.data) {
        res.productNotifyViewModel = res.data.productNotify;
        console.log('si hay data de data dentro modal; ', res.productNotifyViewModel);

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
      console.log('The dialog was closed');
    });
  }
}

