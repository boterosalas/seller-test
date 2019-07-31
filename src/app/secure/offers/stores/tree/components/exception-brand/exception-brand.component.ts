import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-exception-brand',
  templateUrl: './exception-brand.component.html',
  styleUrls: ['./exception-brand.component.scss']
})
export class ExceptionBrandComponent implements OnInit {

  form: FormGroup;
  @ViewChild('dialogContent') content: TemplateRef<any>;

  displayedColumns = ['Brand', 'Exception', 'options'];

  brands = [
    {Name: 'asdlfasdflk'},
    {Name: 'Hydrogen'},
    {Name: 'Helium'},
    {Name: 'Lithium'},
    {Name: 'Beryllium'},
    {Name: 'Boron'},
    {Name: 'Carbon'},
    {Name: 'Nitrogen'},
    {Name: 'Oxygen'},
    {Name: 'Fluorine'},
    {Name: 'Neon'},
    {Name: 'Neon 2'},
    {Name: 'Neon 3'},
    {Name: 'Neon 4'},
    {Name: 'Neon 5'},
    {Name: 'Neon 6'},
    {Name: 'Neon 7'},
  ];

  filterBrands= [];

  dataSource = [
    {Exception: 1, Brand: 'Hydrogen'},
    {Exception: 2, Brand: 'Helium'},
    {Exception: 3, Brand: 'Lithium'},
    {Exception: 4, Brand: 'Beryllium'},
    {Exception: 5, Brand: 'Boron'},
    {Exception: 6, Brand: 'Carbon'},
    {Exception: 7, Brand: 'Nitrogen'},
    {Exception: 8, Brand: 'Oxygen'},
    {Exception: 9, Brand: 'Fluorine'},
    {Exception: 10, Brand: 'Neon'},
  ];

  constructor(private dialog: MatDialog, private fb: FormBuilder) {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      Id: ['', ],
      Brand: ['', Validators.compose([])],
      Exception: ['', Validators.compose([])]
    });
    this.Brand.valueChanges.pipe(distinctUntilChanged(), debounceTime(300)).subscribe(val => {
      if (!!val && val.length >= 2) {
          this.filterBrands = this.brands.filter(brand => brand.Name.toString().toLowerCase().includes(val.toLowerCase()));
          const exist = this.filterBrands.find(brand => brand.Name === val);
          if (!exist) {
              this.Brand.setErrors({ pattern: true });
          } else {
              this.Brand.setErrors(null);
          }
      } else if (!val) {
          this.filterBrands = [];
          this.Brand.setErrors({ required: true });
      } else {
          this.Brand.setErrors({ pattern: true });
      }

  });
  }

  ngOnInit() {
  }

  openDialog(element?: any) {
    const data = !!element ? this.putDataForUpdate(element) : this.putDataForCreate();
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      data: data,
      width: '55%',
      minWidth: '280px'
    });
    this.configDialog(dialogRef.componentInstance);
  }

  configDialog(dialog) {
    dialog.content = this.content;
    dialog.confirmation = () => {

    }
  }

  putDataForUpdate(element: any) {
    this.form.patchValue(element);
    const form = this.form.value;
    const title = 'Editar excepción';
    const message = null;
    const messageCenter = false;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    return {form, title, message, messageCenter, showButtons, icon, btnConfirmationText};
  }

  putDataForCreate() {
    const form = this.form.value;
    const title = 'Agregar excepción';
    const message = null;
    const messageCenter = false;
    const showButtons = true;
    const icon = null;
    const btnConfirmationText = null;
    return {form, title, message, messageCenter, showButtons, icon, btnConfirmationText};
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
