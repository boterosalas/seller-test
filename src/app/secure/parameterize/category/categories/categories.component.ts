import { Component, OnInit, TemplateRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { CategoryTreeService } from '../category-tree.service';
import { LoadingService, ModalService } from '@app/core';
import { updateFunctionality, createFunctionality, MenuModel, categoryName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { trimField, validateDataToEqual, positiveNumber } from '@app/shared/util/validation-messages';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { CreateProcessDialogComponent } from '../../../../shared/components/create-process-dialog/create-process-dialog.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  /**
   * Attribute that represent the regex for the form
   */
  categoryRegex = {
    Commission: '',
    Id: '',
    IdCarulla: '',
    IdCatalogos: '',
    IdExito: '',
    IdMarketplace: '',
    IdParent: '',
    Name: '',
    IdVTEX: '',
    integerNumber: ''
  };

  /**
   * Attribute that represent the type products
   */
  productTypes = [
    'Technology',
    'Clothing'
  ];

  /**
   * Attribute that represent the request category List for the service
   */
  initialCategotyList = [];

  /**
   * Attribute that represent the request category List for the service
   */
  categoryList = [];

  /**
   * Attribute that represent the Update access
   */
  canUpdate = false;

  /**
   * Attribute that represent the create access
   */
  canCreate = false;

  /**
   * Attribute that represent the content for the form
   */
  @ViewChild('dialogContent') content: TemplateRef<any>;

  /**
   * Attribute that represent the form
   */
  form: FormGroup;

  categoryToUpdate: any;

  constructor(
    private categoryService: CategoryTreeService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private regexService: BasicInformationService,
    private snackBar: MatSnackBar,
    private modalService: ModalService
  ) {
  }

  ngOnInit() {
    this.getFunctionalities();
    this.verifyProccesCategory();
    this.getTree();
    this.getRegex();
  }

  /**
   * Method that get the regex for the form
   */
  getRegex() {
    this.loadingService.viewSpinner();
    this.regexService.getRegexInformationBasic(null).subscribe(res => {
      try {
        let dataSellerRegex = JSON.parse(res.body.body);
        dataSellerRegex = !!dataSellerRegex && dataSellerRegex.Data;
        this.categoryRegex.Commission = !!dataSellerRegex && dataSellerRegex.find(element => {
          if (element.Identifier === 'formatNumber' && element.Module === 'ofertas') {
            return element;
          }
        }).Value;
        this.categoryRegex.Name = !!dataSellerRegex && dataSellerRegex.find(element => {
          if (element.Identifier === 'CategoryName' && element.Module === 'parametrizacion') {
            return element;
          }
        }).Value;
        const ids = !!dataSellerRegex && dataSellerRegex.find(element => {
          if (element.Identifier === 'internationalLocation' && element.Module === 'vendedores') {
            return element;
          }
        }).Value;
        this.categoryRegex.integerNumber = !!dataSellerRegex && dataSellerRegex.find(element => {
          if (element.Identifier === 'integerNumber' && element.Module === 'vendedores') {
            return element;
          }
        }).Value;
        if (!!ids) {
          for (const val in this.categoryRegex) {
            if (!!val && val.includes('Id')) {
              this.categoryRegex[val] = ids;
            }
          }
        }
        this.categoryRegex.IdVTEX = !!dataSellerRegex && dataSellerRegex.find(element => {
          if (element.Identifier === 'integerNumber' && element.Module === 'vendedores') {
            return element;
          }
        }).Value;
      } catch {
        this.modalService.showModal('errorService');
      }
      this.initForm();
    });
  }

  /**
   * Method that initialize the form
   */
  initForm() {
    this.form = this.fb.group({
      Commission: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.Commission), positiveNumber])],
      Id: ['', Validators.pattern(this.categoryRegex.Id)],
      IdCarulla: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.IdCarulla)])],
      IdCatalogos: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.IdCatalogos)])],
      IdExito: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.IdExito)])],
      IdMarketplace: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.IdMarketplace)])],
      IdParent: ['', Validators.pattern(this.categoryRegex.IdParent)],
      NameParent: [''],
      Name: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.Name)])],
      ProductType: ['', Validators.compose([Validators.required])],
      IdVTEX: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.IdVTEX)])],
      Tariff: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.Commission), Validators.max(100), Validators.min(0), positiveNumber])],
      TariffCode: ['', Validators.compose([Validators.required, trimField, Validators.pattern(this.categoryRegex.integerNumber), Validators.maxLength(10), Validators.minLength(10)])]
    });
  }

  /**
   * MEthod that get the permissions for the component
   */
  getFunctionalities() {
    this.canUpdate = this.authService.getPermissionForMenu(categoryName, updateFunctionality);
    this.canCreate = this.authService.getPermissionForMenu(categoryName, createFunctionality);
  }

  /**
   * Method that get the category list
   */
  getTree() {
    this.loadingService.viewSpinner();
    this.categoryService.getCategoryTree().subscribe((response: any) => {
      if (!!response && !!response.status && response.status === 200) {
        this.initialCategotyList = JSON.parse(response.body.body).Data;
        this.categoryList = this.orderData(this.initialCategotyList);
      } else {
        this.modalService.showModal('errorService');
      }
      this.loadingService.closeSpinner();
    });
  }

  verifyProccesCategory() {
    this.loadingService.viewSpinner();
    this.categoryService.verifyStatusOfCreateCategory().subscribe((res) => {
      try {
        const response = JSON.parse(res.body.body).Data;
        const { Status } = response;
        if (Status === 1 || Status === 4) {
          this.openStatusModal();
          this.loadingService.closeSpinner();
        }
      } catch {
        this.modalService.showModal('errorService');
      }
    });
  }

  /**
   * Method add the Son attribute for the category list
   * @param dataList category list
   */
  orderData(dataList: any[]) {
    dataList.map(element => {
      if (!element.Son) {
        element.Son = [];
      }
      if (!element.Show) {
        element.Show = false;
      }
      return element;
    });
    return this.orderCategoryList(dataList);
  }

  /**
   * Method that construc the category tree
   * @param list category list
   */
  orderCategoryList(list: any[]) {
    return list.reduce((previous, current) => {
      list.forEach((element) => {
        if (!!element.IdParent && current.Id === element.IdParent) {
          current.Son.push(element);
        }
      });
      if (!current.IdParent) {
        previous.push(current);
      }
      return previous;
    }, []);
  }

  /**
   * Method that expand the tree
   */
  expandTree() {
    this.loadingService.viewSpinner();
    this.ngZone.runOutsideAngular(() => {
      this.showCategoryList(this.categoryList, true);
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Method that contract the tree
   */
  contractTree() {
    this.loadingService.viewSpinner();
    this.ngZone.runOutsideAngular(() => {
      this.showCategoryList(this.categoryList, false);
      this.loadingService.closeSpinner();
    });
  }

  /**
   * Method that expand or contract the category list
   * @param list category list
   * @param show boolean for expand or contract
   */
  showCategoryList(list: any[], show: boolean) {
    list.map(element => {
      element.Show = show;
      if (!!element.Son && element.Son.length > 0) {
        this.showCategoryList(element.Son, show);
      }
    });
  }

  /**
   * Method that open the dialog with category data
   * @param category
   * @param edit boolean for edit or create
   */
  openCategoryDialog(category: any = null, edit: boolean = false) {
    const dataDialog = !!edit ? this.putDataEditDialog(category) : this.putDataCreateDialog(category);
    const dialogRef = this.dialog.open(DialogWithFormComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      data: dataDialog
    });
    setTimeout(() => {
      this.configDataDialog(dialogRef);
    });
  }

  /**
   * Method that put the data for Create dialog
   * @param category
   */
  putDataCreateDialog(category: any) {
    const title = 'Crear una categoría';
    const message = 'Para crear una categoría debes ingresar su nombre y los códigos de homologación de cada uno de los canales. Asegúrate de diligenciar y revisar la información, ya que las categorías no se podrán eliminar posteriormente.';
    const icon = null;
    let form = null;
    const messageCenter = false;
    const showButtons = true;
    const btnConfirmationText = null;
    if (category) {
      const { Name, Id } = category;
      this.NameParent.setValue(Name);
      this.IdParent.setValue(Id);
    }
    this.NameParent.disable();
    const initialValue = Object.assign(this.form.value, {});
    this.form.setValidators(validateDataToEqual(initialValue));
    this.Commission.enable();
    form = this.form;
    return { title, message, icon, form, messageCenter, showButtons, btnConfirmationText };
  }

  /**
   * Method that put the data for edit dialog
   * @param category
   */
  putDataEditDialog(category: any) {
    const title = 'Modificar una categoría';
    const message = 'Para modificar una categoría debes cambiar la información en cualquiera de los campos habilitados. No podrás modificar información que se encuentre bloqueada y todos los campos deben estar diligenciados para poder guardar la modificación.';
    const icon = null;
    let form = null;
    const messageCenter = false;
    const showButtons = true;
    const btnConfirmationText = null;
    if (category) {
      this.form.patchValue(category);
      !!this.ProductType && !!category.ProductType && this.ProductType.setValue(category.ProductType);
      this.NameParent.setValue(this.findParentName(category.IdParent));
      this.categoryToUpdate = category;
    }
    this.NameParent.disable();
    this.Commission.disable();
    const initialValue = Object.assign(this.form.value, {});
    this.form.setValidators(validateDataToEqual(initialValue));
    form = this.form;
    return { title, message, icon, form, messageCenter, showButtons, btnConfirmationText };
  }

  /**
   * Method that find the category by id
   * @param idParent id of category parent
   */
  findParentName(idParent: any) {
    const parent = this.initialCategotyList.find(element => element.Id === idParent);
    return !!parent ? parent.Name : null;
  }

  /**
   * method that config the data for a dialog
   * @param dialog
   */
  configDataDialog(dialog: MatDialogRef<DialogWithFormComponent>) {
    const dialogIntance = dialog.componentInstance;
    dialogIntance.content = this.content;
    dialogIntance.confirmation = () => {
      this.loadingService.viewSpinner();
      let value = Object.assign({}, this.form.value);
      value = !!value.Id ? value : (delete value.Id && value);
      value.Commission =  !!value.Commission ? value.Commission : this.Commission.value;
      const serviceResponse = !!value.Id ? this.categoryService.updateCategory(value) : this.categoryService.createCategory(value);
      serviceResponse.subscribe(response => {
        try {
          if (!!response && !!response.statusCode && (response.statusCode === 200)) {
            const responseValue = JSON.parse(response.body).Data;
            if (!!responseValue.Id) {
              this.loadingService.closeSpinner();
              dialogIntance.onNoClick();
              this.openStatusModal();
            } else if (responseValue === true) {
              this.confirmationUpdate(value);
              this.loadingService.closeSpinner();
              dialogIntance.onNoClick();
              this.snackBar.open('Actualizado correctamente', 'Cerrar', {
                duration: 3000,
              });
            }
          }  else if ( !!response && !!response.statusCode && response.statusCode === 400) {
            const responseValue = JSON.parse(response.body).Errors;
            const message = responseValue[0].Message;
            this.loadingService.closeSpinner();
            this.snackBar.open(message, 'Cerrar', {
              duration: 3000,
            });
          }
        } catch (error) {
          this.loadingService.closeSpinner();
          this.modalService.showModal('errorService');
        }
      });
    };
    dialog.afterClosed().subscribe(() => {
      this.form.reset();
    });
  }

  updateCategory(list: any[], value: any) {
    list.forEach((element) => {
      if (element.Id === value.Id) {
        for (const val in element) {
          if (!!val) {
            element[val] = value[val];
          }
        }
      } else {
        this.updateCategory(element.Son, value);
      }
    });
  }

  confirmationUpdate(value: any) {
    this.ngZone.runOutsideAngular(() => {
      if (!!value.Id) {
        value.Show = this.categoryToUpdate.Show;
        value.Son = this.categoryToUpdate.Son;
        this.updateCategory(this.categoryList, value);
        this.categoryToUpdate = null;
      }
    });
  }

  openStatusModal() {
    this.loadingService.viewSpinner();
    const data = {
      successText: 'Creación realizada con éxito',
      failText: 'No se pudo crear la categoría',
      processText: 'Creación en proceso',
      initTime: 500,
      intervalTime: 5000
    };
    const dialog = this.dialog.open(CreateProcessDialogComponent, {
      width: '70%',
      minWidth: '280px',
      maxHeight: '80vh',
      data: data
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.categoryService.verifyStatusOfCreateCategory();
    dialogIntance.processFinish$.subscribe((val) => {
      if (!!val) {
        this.getTree();
        this.snackBar.open('Categoria creada satisfactoriamente', 'Cerrar', {
          duration: 3000
        });
      }
    });
    this.loadingService.closeSpinner();
  }

  get Commission(): FormControl {
    return this.form.get('Commission') as FormControl;
  }

  get Id(): FormControl {
    return this.form.get('Id') as FormControl;
  }

  get IdCarulla(): FormControl {
    return this.form.get('IdCarulla') as FormControl;
  }

  get IdCatalogos(): FormControl {
    return this.form.get('IdCatalogos') as FormControl;
  }

  get IdExito(): FormControl {
    return this.form.get('IdExito') as FormControl;
  }

  get IdMarketplace(): FormControl {
    return this.form.get('IdMarketplace') as FormControl;
  }

  get IdParent(): FormControl {
    return this.form.get('IdParent') as FormControl;
  }

  get NameParent(): FormControl {
    return this.form.get('NameParent') as FormControl;
  }

  get Name(): FormControl {
    return this.form.get('Name') as FormControl;
  }

  get ProductType(): FormControl {
    return this.form.get('ProductType') as FormControl;
  }

  get IdVTEX(): FormControl {
    return this.form.get('IdVTEX') as FormControl;
  }

  get Tariff(): FormControl {
    return this.form.get('Tariff') as FormControl;
  }

  get TariffCode(): FormControl {
    return this.form.get('TariffCode') as FormControl;
  }

}
