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
  typeForm: FormGroup;
  @ViewChild('dialogContent') content: TemplateRef<any>;

  displayedColumns = ['Brand', 'Comission', 'options'];
  displayedColumnsInModal = ['Brand', 'Comission'];
  validation = new BehaviorSubject(true);
  brands = [];
  selectedBrands = [];
  selectedBrandsSources = new MatTableDataSource(this.selectedBrands);
  filterBrands = [];
  preDataSource = [
    { Id: 1, Comission: 1, Brand: 'Hydrogen' },
    { Id: 2, Comission: 2, Brand: 'Helium' },
    { Id: 3, Comission: 3, Brand: 'Lithium' },
    { Id: 4, Comission: 4, Brand: 'Beryllium' },
    { Id: 5, Comission: 5, Brand: 'Boron' },
    { Id: 6, Comission: 6, Brand: 'Carbon' },
    { Id: 7, Comission: 7, Brand: 'Nitrogen' },
    { Id: 8, Comission: 8, Brand: 'Oxygen' },
    { Id: 9, Comission: 9, Brand: 'Fluorine' },
    { Id: 10, Comission: 10, Brand: 'Neon' },
  ];

  dataSource: MatTableDataSource<any>;

  regex;


  typeException = ['Marca'];

  constructor(private dialog: MatDialog,
    private fb: FormBuilder,
    private regexService: BasicInformationService,
    private loadingService: LoadingService) {
      this.typeForm = this.fb.group({
        type: ['']
      })
    this.getRegex();
    this.getBrands();
    this.dataSource = new MatTableDataSource(this.preDataSource);
    this.typeForm.get('type').valueChanges.subscribe( (val) => {
      this.changeType(val);
    });
  }

  changeType(val: any) {

  }

  getBrands() {
    this.loadingService.viewSpinner();
    this.regexService.getActiveBrands().subscribe(brands => {
      this.loadingService.closeSpinner();
      const initialBrands = brands.Data.Brands;

      this.brands = initialBrands.sort((a, b) => {
        if (a.Name > b.Name) {
          return 1;
        }
        if (a.Name < b.Name) {
          return -1;
        }
        return 0;
      });
      this.brands = this.brands.map(element => {
        const newElement = { Name: element.Name };
        return newElement;
      });
    });
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
      Comission: ['', Validators.compose([trimField, Validators.required, Validators.max(30), Validators.min(0), Validators.pattern(this.regex)])]
    });
    this.Comission.disable();
    this.Brand.valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
        this.filterBrands = this.brands.filter(brand => brand.Name.toString().toLowerCase().includes(val.toLowerCase()));
        const exist = this.filterBrands.find(brand => brand.Name === val);
        if (!exist) {
          this.Brand.setErrors({ pattern: true });
        } else {
          this.Brand.setErrors(null);
          this.Comission.enable();
        }
      } else if (!val) {
        this.filterBrands = [];
        this.Brand.setErrors({ required: true });
        this.Comission.disable();
      } else {
        this.Brand.setErrors({ pattern: true });
      }

    });
  }

  ngOnInit() {
  }

  openDialog(action: string, element?: any) {
    this.form.setValidators(null);
    const data = !!(action === 'edit') ? this.putDataForUpdate(element) : !!(action === 'create') ? this.putDataForCreate() : this.putDataForDelete();
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      data: data,
      width: '55%',
      minWidth: '280px'
    });
    const dataToConfig = !!element ? { action, element } : { action };
    this.configDialog(dialogRef.componentInstance, dataToConfig);
    dialogRef.afterClosed().subscribe(() => {
      this.selectedBrands = [];
      this.validation.next(true);
    });
  }

  configDialog(dialog: any, data: any) {
    if (data.action !== 'delete'){
      dialog.content = this.content;
    }
    dialog.confirmation = () => {
      switch (data.action) {
        case 'create':
          this.selectedBrands.forEach(element => {
            this.preDataSource.push(element);
          });
          this.dataSource.data = this.preDataSource;
          break;
        case 'edit':
          break;
        case 'delete':
          this.removeElement(data.element);
          break;
      };
    };
  }

  putDataForDelete() {
    const form = null;
    const title = 'Eliminar excepción';
    const message = 'Estás seguro que deseas eliminar esta excepción';
    const messageCenter = true;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    return { form, title, message, messageCenter, showButtons, icon, btnConfirmationText };
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
    this.selectedBrands.push(Object.assign(this.form.value, {}));
    this.selectedBrandsSources.data = this.selectedBrands;
    this.form.reset();
    this.validation.next(false);
  }

  deleteElement(element: any) {
    this.openDialog('delete', element);
  }

  removeElement(element) {
    const index = this.preDataSource.findIndex(value => value === element);
    !!index && this.preDataSource.splice(index, 1);
    this.dataSource.data = this.preDataSource;
  }

  get Brand(): FormControl {
    return this.form.get('Brand') as FormControl;
  }

  get Comission(): FormControl {
    return this.form.get('Comission') as FormControl;
  }
}
