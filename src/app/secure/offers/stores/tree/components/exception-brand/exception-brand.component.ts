import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { validateDataToEqual, trimField } from '@app/shared/util/validation-messages';
import { BehaviorSubject, timer } from 'rxjs';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { LoadingService } from '@app/core';

@Component({
  selector: 'app-exception-brand',
  templateUrl: './exception-brand.component.html',
  styleUrls: ['./exception-brand.component.scss']
})
export class ExceptionBrandComponent implements OnInit {

  form: FormGroup;
  @ViewChild('dialogContent') content: TemplateRef<any>;

  displayedColumns = ['Brand', 'Exception', 'options'];
  displayedColumnsInModal = ['Brand', 'Exception'];

  validation = new BehaviorSubject(true);

  brands = [
    { Name: 'asdlfasdflk' },
    { Name: 'Hydrogen' },
    { Name: 'Helium' },
    { Name: 'Lithium' },
    { Name: 'Beryllium' },
    { Name: 'Boron' },
    { Name: 'Carbon' },
    { Name: 'Nitrogen' },
    { Name: 'Oxygen' },
    { Name: 'Fluorine' },
    { Name: 'Neon' },
    { Name: 'Neon 2' },
    { Name: 'Neon 3' },
    { Name: 'Neon 4' },
    { Name: 'Neon 5' },
    { Name: 'Neon 6' },
    { Name: 'Neon 7' },
  ];

  selectedBrands = [];
  selectedBrandsSources = new MatTableDataSource(this.selectedBrands);

  filterBrands = [];

  preDataSource = [
    { Id: 1, Exception: 1, Brand: 'Hydrogen' },
    { Id: 2, Exception: 2, Brand: 'Helium' },
    { Id: 3, Exception: 3, Brand: 'Lithium' },
    { Id: 4, Exception: 4, Brand: 'Beryllium' },
    { Id: 5, Exception: 5, Brand: 'Boron' },
    { Id: 6, Exception: 6, Brand: 'Carbon' },
    { Id: 7, Exception: 7, Brand: 'Nitrogen' },
    { Id: 8, Exception: 8, Brand: 'Oxygen' },
    { Id: 9, Exception: 9, Brand: 'Fluorine' },
    { Id: 10, Exception: 10, Brand: 'Neon' },
  ];

  dataSource: MatTableDataSource<any>;

  regex;

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private regexService: BasicInformationService,
    private loadingService: LoadingService) {
    this.getRegex();
    this.dataSource = new MatTableDataSource(this.preDataSource);
  }

  getRegex() {
    this.loadingService.viewSpinner();
    this.regexService.getRegexInformationBasic(null).subscribe(res => {
      const { Data } = !!res && !!res.body && !!res.body.body && JSON.parse(res.body.body);
      if (!!Data && Data.length) {
        this.regex = Data.find(element => {
          if (element.Identifier === 'formatNumber' && element.Module === 'ofertas') {
            return element;
          }
        }).Value;
        this.loadingService.closeSpinner();
        this.initForm();
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      Id: ['',],
      Brand: ['', Validators.compose([trimField, Validators.required, Validators.minLength(2)])],
      Exception: ['', Validators.compose([trimField, Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(this.regex)])]
    });
    this.Exception.disable();
    this.Brand.valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterBrands = this.brands.filter(brand => brand.Name.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterBrands.find(brand => brand.Name === val);
        if (!exist) {
          this.Brand.setErrors({ pattern: true });
        } else {
          this.Brand.setErrors(null);
          this.Exception.enable();
        }
      } else if (!val) {
        this.filterBrands = [];
        this.Brand.setErrors({ required: true });
        this.Exception.disable();
      } else {
        this.Brand.setErrors({ pattern: true });
      }

    });
  }

  ngOnInit() {
  }

  openDialog(element?: any) {
    this.form.setValidators(null);
    const data = !!element ? this.putDataForUpdate(element) : this.putDataForCreate();
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      data: data,
      width: '55%',
      minWidth: '280px'
    });
    this.configDialog(dialogRef.componentInstance);
    dialogRef.afterClosed().subscribe(() => {
      this.selectedBrands = [];
      this.validation.next(true);
    });
  }

  configDialog(dialog: any) {
    dialog.content = this.content;
    dialog.confirmation = () => {

    };
  }

  putDataForUpdate(element: any) {
    this.form.patchValue(element);
    const initialValue = Object.assign(this.form.value, {});
    this.form.setValidators(validateDataToEqual(initialValue));
    const form = this.form;
    const title = 'Editar excepción';
    const message = null;
    const messageCenter = false;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    return { form, title, message, messageCenter, showButtons, icon, btnConfirmationText };
  }

  putDataForCreate() {
    const form = this.form;
    const title = 'Agregar excepción';
    const message = null;
    const messageCenter = false;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    const validation = this.validation;
    return { form, title, message, messageCenter, showButtons, icon, btnConfirmationText, validation };
  }

  addBrand() {
    console.log(this.form.value);
    this.selectedBrands.push(Object.assign(this.form.value, {}));
    this.selectedBrandsSources.data = this.selectedBrands;
    this.form.reset();
    this.validation.next(false);
  }

  deleteElement(element: any) {
    console.log('remove: ', element);
  }

  get Brand(): FormControl {
    return this.form.get('Brand') as FormControl;
  }

  get Exception(): FormControl {
    return this.form.get('Exception') as FormControl;
  }
}
