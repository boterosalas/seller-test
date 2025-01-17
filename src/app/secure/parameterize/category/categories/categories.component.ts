import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  NgZone,
  ChangeDetectorRef,
  OnDestroy,
} from "@angular/core";
import { CategoryTreeService } from "../category-tree.service";
import { EndpointService, LoadingService, ModalService } from "@app/core";
import {
  updateFunctionality,
  createFunctionality,
  MenuModel,
  categoryName,
  deleteFunctionality,
} from "@app/secure/auth/auth.consts";
import { AuthService } from "@app/secure/auth/auth.routing";
import { MatDialog, MatDialogRef, MatSnackBar } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { DialogWithFormComponent } from "@app/shared/components/dialog-with-form/dialog-with-form.component";
import {
  trimField,
  validateDataToEqual,
  positiveNumber,
} from "@app/shared/util/validation-messages";
import { BasicInformationService } from "@app/secure/products/create-product-unit/basic-information/basic-information.component.service";
import { CreateProcessDialogComponent } from "../../../../shared/components/create-process-dialog/create-process-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { DownloadCategoriesComponent } from "./download-categories/download-categories.component";
import { UploadFileMasiveComponent } from "@app/shared/components/upload-file-masive/upload-file-masive.component";

@Component({
  selector: "app-categories",
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"],
})
export class CategoriesComponent implements OnInit, OnDestroy {
  /**
   * Attribute that represent the regex for the form
   */
  categoryRegex = {
    Commission: "",
    Id: "",
    IdParent: "",
    Name: "",
    IdVTEX: "",
    integerNumber: "",
    SincoSubLineId: "",
    SincoSegmentId: "",
    SincoSubCategoryId: "",
    SincoCategoryId: "",
    SincoSubline: "",
  };

  /**
   * Attribute that represent the type products
   */
  productTypes = ["Technology", "Clothing"];

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

  canDelete = false;

  category: any;

  /**
   * Attribute that represent the content for the form
   */
  @ViewChild("dialogContent", { static: false }) content: TemplateRef<any>;

  /**
   * Attribute that represent the form
   */
  form: FormGroup;

  categoryToUpdate: any;
  msjDeleteCategory: boolean;
  categoryIdDelete: any;
  public urlDownloadFile: string;
  public data: any;

  constructor(
    private categoryService: CategoryTreeService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private ngZone: NgZone,
    private regexService: BasicInformationService,
    private snackBar: MatSnackBar,
    private modalService: ModalService,
    private languageService: TranslateService,
    private api?: EndpointService
  ) {}

  ngOnInit() {
    this.getFunctionalities();
    this.verifyProccesCategory();
    this.verifyProcessMasiveCategory();
    this.getTree();
    this.getRegex();
    this.changeLanguage();
    this.urlDownloadFile = this.api.get("downloadTemplateCategoryMasive");
  }

  /**
   * Metodo para descargar todas las categorías
   * @memberof CategoriesComponent
   */
  openModalDownloadCategories(): void {
    const dialogRef = this.dialog.open(DownloadCategoriesComponent, {
      width: "60%",
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  /**
   * Metodo para descargar todas las categorías
   * @memberof CategoriesComponent
   */
  openModalUploadCategoriesMasive(status?: string, listError?: any): void {
    this.data = {
      initTime: 500,
      intervalTime: 10000,
      status: status,
      listError: listError ? listError : null,
      title: "Cargar categorías",
      positionTitle: "center",
      subTitle:
        "Por favor seleccione el archivo de categorías que desea cargar",
      positionSubtitle: "left",
      dragDrop: {
        msg: "Presione acá o arrastre y suelte el archivo",
        accept: ".xlsx, .xls, .ods",
      },
      btn: {
        btn_1: "",
        btn_2: "",
      },
      services: {
        send: {
          name: "createUpdateMassiveCategories",
          method: "post",
        },
        status: {
          name: "ValidateStatusCreateUpdateMassive",
          method: "get",
        },
      },
      uploadStatus: {
        success: {
          title: "Carga exitosa",
          subTile:
            "El archivo con la información de categorias se ha cargado exitosamente",
          icon: "check_circle",
          colorStatus: "#485AFA",
          btn: [
            {
              btnTitle: "Aceptar",
              action: "close",
              style: "raised",
            },
          ],
        },
        proccess: {
          title: "Carga en proceso",
          subTile: null,
          icon: "autorenew",
          colorStatus: "#485AFA",
          btn: [
            {
              btnTitle: "Ir al inicio",
              action: "goToHome",
              style: "raised",
            },
          ],
        },
        error: {
          title:
            "Ha ocurrido un error al momento de cargar el archivo de categorías",
          subTile: null,
          icon: "report_problem",
          nameFile: "Bulk_load_category",
          btn: [
            {
              btnTitle: "Cerrar",
              action: "close",
              style: "raised",
            },
            {
              btnTitle: "Exportar a exccel",
              action: "exportExcel",
              style: "raised",
            },
          ],
        },
      },
    };
    const dialogRef = this.dialog.open(UploadFileMasiveComponent, {
      width: "50%",
      data: this.data,
      disableClose: true,
    });
    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      if (val) {
        this.getTree();
      }
    });
  }

  /**
   * Method that get the regex for the form
   */
  getRegex() {
    this.loadingService.viewSpinner();
    this.regexService.getRegexInformationBasic(null).subscribe((res) => {
      try {
        let dataSellerRegex = JSON.parse(res.body.body);
        dataSellerRegex = !!dataSellerRegex && dataSellerRegex.Data;
        this.categoryRegex.Commission =
          !!dataSellerRegex &&
          dataSellerRegex.find((element) => {
            if (
              element.Identifier === "formatNumber" &&
              element.Module === "ofertas"
            ) {
              return element;
            }
          }).Value;
        this.categoryRegex.Name =
          !!dataSellerRegex &&
          dataSellerRegex.find((element) => {
            if (
              element.Identifier === "CategoryName" &&
              element.Module === "parametrizacion"
            ) {
              return element;
            }
          }).Value;
        const ids =
          !!dataSellerRegex &&
          dataSellerRegex.find((element) => {
            if (
              element.Identifier === "internationalLocation" &&
              element.Module === "vendedores"
            ) {
              return element;
            }
          }).Value;
        this.categoryRegex.integerNumber =
          !!dataSellerRegex &&
          dataSellerRegex.find((element) => {
            if (
              element.Identifier === "integerNumber" &&
              element.Module === "vendedores"
            ) {
              return element;
            }
          }).Value;
        if (!!ids) {
          for (const val in this.categoryRegex) {
            if (!!val && val.includes("Id")) {
              this.categoryRegex[val] = ids;
            }
          }
        }
        this.categoryRegex.IdVTEX =
          !!dataSellerRegex &&
          dataSellerRegex.find((element) => {
            if (
              element.Identifier === "integerNumber" &&
              element.Module === "vendedores"
            ) {
              return element;
            }
          }).Value;

        this.categoryRegex.SincoSubline =
          !!dataSellerRegex &&
          dataSellerRegex.find((element) => {
            if (
              element.Identifier === "integerNumber" &&
              element.Module === "vendedores"
            ) {
              return element;
            }
          }).Value;
      } catch {
        this.modalService.showModal("errorService");
      }
      this.initForm();
    });
  }

  /**
   * Method that initialize the form
   */
  initForm() {
    this.form = this.fb.group({
      Commission: [
        "",
        Validators.compose([
          Validators.required,
          trimField,
          Validators.pattern(this.categoryRegex.Commission),
          positiveNumber,
        ]),
      ],
      Id: ["", Validators.pattern(this.categoryRegex.Id)],
      IdParent: ["", Validators.pattern(this.categoryRegex.IdParent)],
      NameParent: [""],
      Name: [
        "",
        Validators.compose([
          Validators.required,
          trimField,
          Validators.pattern(this.categoryRegex.Name),
        ]),
      ],
      ProductType: ["", Validators.compose([Validators.required])],
      IdVTEX: [
        "",
        Validators.compose([
          Validators.required,
          trimField,
          Validators.pattern(this.categoryRegex.IdVTEX),
        ]),
      ],
      SincoSubLineId: [
        "",
        Validators.compose([
          Validators.required,
          trimField,
          Validators.pattern(this.categoryRegex.SincoSubLineId),
          Validators.maxLength(15),
          positiveNumber,
        ]),
      ],
      SincoCategoryId: [
        "",
        Validators.compose([
          Validators.pattern(this.categoryRegex.SincoSubline),
          Validators.maxLength(15),
          Validators.min(0),
        ]),
      ],
      SincoSubCategoryId: [
        "",
        Validators.compose([
          Validators.pattern(this.categoryRegex.SincoSubline),
          Validators.maxLength(15),
          Validators.min(0),
        ]),
      ],
      SincoSegmentId: [
        "",
        Validators.compose([
          Validators.pattern(this.categoryRegex.SincoSubline),
          Validators.maxLength(15),
          Validators.min(0),
        ]),
      ],

      Tariff: [
        "",
        Validators.compose([
          Validators.required,
          trimField,
          Validators.pattern(this.categoryRegex.Commission),
          Validators.max(100),
          Validators.min(0),
          positiveNumber,
        ]),
      ],
      TariffCode: [
        "",
        Validators.compose([
          Validators.required,
          trimField,
          Validators.pattern(this.categoryRegex.integerNumber),
          Validators.maxLength(10),
          Validators.minLength(10),
        ]),
      ],
      VtexIdCarulla: [
        "",
        Validators.compose([
          Validators.required,
          trimField,
          Validators.pattern(this.categoryRegex.IdVTEX),
        ]),
      ],
    });
  }

  /**
   * MEthod that get the permissions for the component
   */
  getFunctionalities() {
    this.canUpdate = this.authService.getPermissionForMenu(
      categoryName,
      updateFunctionality
    );
    this.canCreate = this.authService.getPermissionForMenu(
      categoryName,
      createFunctionality
    );
    this.canDelete = this.authService.getPermissionForMenu(
      categoryName,
      deleteFunctionality
    );
  }

  /**
   * Method that get the category list
   */
  getTree() {
    this.categoryService.getCategoryTree().subscribe((response: any) => {
      if (!!response && !!response.status && response.status === 200) {
        this.initialCategotyList = JSON.parse(response.body.body).Data;
        this.categoryList = this.orderData(this.initialCategotyList);
      } else {
        this.modalService.showModal("errorService");
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
        this.modalService.showModal("errorService");
      }
    });
  }
  /**
   * Funcion para verificar la carga masiva de categorias
   *
   * @memberof CategoriesComponent
   */
  verifyProcessMasiveCategory() {
    this.loadingService.viewSpinner();
    this.categoryService
      .validateStatusCreateUpdateMassive()
      .subscribe((res) => {
        try {
          const response = JSON.parse(res.body.body).Data;
          const { Status, Response, Checked } = response;
          if (Status === 1 || Status === 4) {
            this.openModalUploadCategoriesMasive(Status, null);
            this.loadingService.closeSpinner();
          }
          if (Status === 3 && Checked === "false") {
            const listError = JSON.parse(Response);
            this.openModalUploadCategoriesMasive(Status, listError.Errors);
            this.loadingService.closeSpinner();
          }
        } catch {
          this.modalService.showModal("errorService");
        }
      });
  }

  /**
   * Method add the Son attribute for the category list
   * @param dataList category list
   */
  orderData(dataList: any[]) {
    dataList.map((element) => {
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
    list.map((element) => {
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
  openCategoryDialog(
    category: any = null,
    edit: boolean = false,
    deleteCategorie: boolean = false
  ) {
    let dataDialog;
    this.msjDeleteCategory = false;
    if (deleteCategorie) {
      this.msjDeleteCategory = true;
      this.categoryIdDelete = category.Id;
      dataDialog = this.putDataDeleteDialog(category);
      const dialogRef = this.dialog.open(DialogWithFormComponent, {
        width: "40%",
        height: "60%",
        minWidth: "280px",
        maxHeight: "80vh",
        data: dataDialog,
      });
      setTimeout(() => {
        this.configDataDialog(dialogRef);
      });
    } else {
      dataDialog = !!edit
        ? this.putDataEditDialog(category)
        : this.putDataCreateDialog(category);
      const dialogRef = this.dialog.open(DialogWithFormComponent, {
        width: "70%",
        height: "90%",
        minWidth: "280px",
        maxHeight: "80vh",
        data: dataDialog,
      });
      setTimeout(() => {
        this.configDataDialog(dialogRef);
      });
    }
  }

  /**
   * Method that put the data for Create dialog
   * @param category
   */
  putDataCreateDialog(category: any) {
    const title = this.languageService.instant(
      "secure.parametize.category.categories.modal_create_title"
    );
    const message = this.languageService.instant(
      "secure.parametize.category.categories.modal_create_description"
    );
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
    return {
      title,
      message,
      icon,
      form,
      messageCenter,
      showButtons,
      btnConfirmationText,
    };
  }

  /**
   * Method that put the data for edit dialog
   * @param category
   */
  putDataEditDialog(category: any) {
    this.category = category;
    const title = this.languageService.instant(
      "secure.parametize.category.categories.modal_update_title"
    );
    const message = this.languageService.instant(
      "secure.parametize.category.categories.modal_update_description"
    );
    const icon = null;
    let form = null;
    const messageCenter = false;
    const showButtons = true;
    const btnConfirmationText = null;
    if (category) {
      this.form.patchValue(category);
      // tslint:disable-next-line: no-unused-expression
      !!this.ProductType &&
        !!category.ProductType &&
        this.ProductType.setValue(category.ProductType);
      this.NameParent.setValue(this.findParentName(category.IdParent));
      this.categoryToUpdate = category;
    }
    this.NameParent.disable();
    this.Commission.disable();
    const initialValue = Object.assign(this.form.value, {});
    this.form.setValidators(validateDataToEqual(initialValue));
    form = this.form;
    return {
      title,
      message,
      icon,
      form,
      messageCenter,
      showButtons,
      btnConfirmationText,
    };
  }

  /**
   * DataDialog para eliminar categorías
   * @param {*} category
   * @returns
   * @memberof CategoriesComponent
   */
  putDataDeleteDialog(category: any) {
    this.category = category;
    const title = this.languageService.instant(
      "secure.parametize.category.categories.modal_delete_title"
    );
    const message =
      this.languageService.instant(
        "secure.parametize.category.categories.modal_delete_subtitle"
      ) +
      ": " +
      category.Name +
      "?";
    const showButtons = true;
    const btnConfirmationText = null;
    const msjDeleteCategory = this.msjDeleteCategory;
    return {
      title,
      message,
      showButtons,
      btnConfirmationText,
      msjDeleteCategory,
    };
  }

  /**
   * Method that find the category by id
   * @param idParent id of category parent
   */
  findParentName(idParent: any) {
    const parent = this.initialCategotyList.find(
      (element) => element.Id === idParent
    );
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
      value = !!value.Id ? value : delete value.Id && value;
      value.Commission = !!value.Commission
        ? value.Commission
        : this.Commission.value;
      if (
        value.Tariff === "000" ||
        value.Tariff === "0000" ||
        value.Tariff === "00000" ||
        value.Tariff === "00" ||
        value.Tariff === "0.00"
      ) {
        value.Tariff = 0;
      }
      if (this.category) {
        value.Label = this.category.Label;
      }
      let serviceResponse;
      let idCategory;
      if (this.msjDeleteCategory) {
        idCategory = "?id=" + this.categoryIdDelete;
        serviceResponse = this.categoryService.deleteCategory(idCategory);
      } else {
        serviceResponse = !!value.Id
          ? this.categoryService.updateCategory(value)
          : this.categoryService.createCategory(value);
      }
      serviceResponse.subscribe((response) => {
        if (
          !!response &&
          !!response.statusCode &&
          response.statusCode === 200
        ) {
          const responseValue = JSON.parse(response.body).Data;
          if (!!responseValue.Id) {
            this.loadingService.closeSpinner();
            dialogIntance.onNoClick();
            this.openStatusModal();
          } else if (responseValue === true) {
            this.getTree();
            dialogIntance.onNoClick();
            const message = JSON.parse(response.body).Message;
            this.snackBar.open(
              message,
              this.languageService.instant("actions.close"),
              {
                duration: 3000,
              }
            );
            this.categoryIdDelete = "";
          }
          this.loadingService.closeSpinner();
        } else if (
          !!response &&
          !!response.statusCode &&
          response.statusCode === 400
        ) {
          const responseValue = JSON.parse(response.body).Errors;
          const message = responseValue[0].Message;
          this.loadingService.closeSpinner();
          this.snackBar.open(
            message,
            this.languageService.instant("actions.close"),
            {
              duration: 3000,
            }
          );
        } else {
          this.loadingService.closeSpinner();
          this.modalService.showModal("errorService");
        }
      });
    };
    dialog.afterClosed().subscribe(() => {
      this.form.reset();
    });
  }
  /**
   * funcion para abrir el modal de status para la carga
   *
   * @memberof CategoriesComponent
   */
  openStatusModal() {
    this.loadingService.viewSpinner();
    const data = {
      successText: this.languageService.instant(
        "secure.parametize.category.categories.creation_succesfully"
      ),
      failText: this.languageService.instant(
        "secure.parametize.category.categories.not_create_category"
      ),
      processText: this.languageService.instant(
        "secure.parametize.category.categories.create_in_process"
      ),
      initTime: 500,
      intervalTime: 10000,
    };
    const dialog = this.dialog.open(CreateProcessDialogComponent, {
      width: "70%",
      minWidth: "280px",
      maxHeight: "80vh",
      disableClose: true,
      data: data,
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.request = this.categoryService.verifyStatusOfCreateCategory();
    dialogIntance.processFinish$.subscribe((val) => {
      if (!!val) {
        this.getTree();
        this.snackBar.open(
          this.languageService.instant("shared.create_successfully"),
          this.languageService.instant("actions.close"),
          {
            duration: 3000,
          }
        );
      }
    });
    this.loadingService.closeSpinner();
  }
  /**
   * funcion para escuchar el evento al cambiar de idioma
   *
   * @memberof CategoriesComponent
   */
  changeLanguage() {
    this.languageService.onLangChange.subscribe((e: Event) => {
      localStorage.setItem("culture_current", e["lang"]);
      this.getTree();
    });
  }

  get Commission(): FormControl {
    return this.form.get("Commission") as FormControl;
  }

  get Id(): FormControl {
    return this.form.get("Id") as FormControl;
  }

  get IdParent(): FormControl {
    return this.form.get("IdParent") as FormControl;
  }

  get NameParent(): FormControl {
    return this.form.get("NameParent") as FormControl;
  }

  get Name(): FormControl {
    return this.form.get("Name") as FormControl;
  }

  get ProductType(): FormControl {
    return this.form.get("ProductType") as FormControl;
  }

  get IdVTEX(): FormControl {
    return this.form.get("IdVTEX") as FormControl;
  }

  get VtexIdCarulla(): FormControl {
    return this.form.get("VtexIdCarulla") as FormControl;
  }

  get Tariff(): FormControl {
    return this.form.get("Tariff") as FormControl;
  }

  get TariffCode(): FormControl {
    return this.form.get("TariffCode") as FormControl;
  }

  get SincoSubLineId(): FormControl {
    return this.form.get("SincoSubLineId") as FormControl;
  }

  get SincoCategoryId(): FormControl {
    return this.form.get("SincoCategoryId") as FormControl;
  }
  get SincoSubCategoryId(): FormControl {
    return this.form.get("SincoSubCategoryId") as FormControl;
  }
  get SincoSegmentId(): FormControl {
    return this.form.get("SincoSegmentId") as FormControl;
  }
  /**
   * funcuion para eliminar el componente de modal cuando se cierra la session
   *
   * @memberof CategoriesComponent
   */
  ngOnDestroy() {
    if (this.dialog) {
      this.dialog.closeAll();
    }
  }
}
