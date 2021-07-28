import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { LoadingService } from "@app/core";
import { SearchOrderMenuService } from "@app/core/shell/search-order-menu/search-order-menu.service";
import { MyProfileService } from "@app/secure/aws-cognito/profile/myprofile.service";
import { StoreModel } from "@app/secure/offers/stores/models/store.model";
import { EventEmitterSeller } from "@app/shared/events/eventEmitter-seller.service";
import { TranslateService } from "@ngx-translate/core";
import moment from "moment";
import { Subscription, Observable } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";
import { ReportOrderService } from "./report-order.service";

@Component({
  selector: "app-report-order",
  templateUrl: "./report-order.component.html",
  styleUrls: ["./report-order.component.scss"],
})
export class ReportOrderComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  InitialSubscription: Subscription;
  formSubuscription: Subscription;
  sendReportSubscription: Subscription;

  isAdmin: any;
  sellerId: any;
  options: any;

  IsClickEnable = false;
  keywords = [];
  arraySellerId = [];
  nameLists = [];
  seller: any;
  disabledButton = true;
  disabledCheckBox = true;
  clearSearch = false;
  valueCheck = false;
  selectSeller = false;
  exportAll = false;

  fromDate = moment(moment().subtract(1, "month")).toISOString();
  toDate = moment().toISOString();
  maxToDate = this.toDate;
  listOrderStatus = [];
  optionsCheck = [];

  constructor(
    public translateService: TranslateService,
    public eventsSeller: EventEmitterSeller,
    private loadingService: LoadingService,
    public snackBar?: MatSnackBar,
    private profileService?: MyProfileService,
    private statusOrdersSvc?: SearchOrderMenuService,
    private reportOrdersSvc?: ReportOrderService
  ) {}

  ngOnInit() {
    this.getAllDataUser();
    this.createForm();
    this.getSatatusOrders();
    this.InitialSubscription =
      this.eventsSeller.eventSearchSellerModal.subscribe(
        (seller: StoreModel) => {
          if (seller) {
            if (seller.IdSeller) {
              this.IsClickEnable = true;
              this.seller = seller;
              this.clearSearch = false;
            }
          }
        }
      );
  }

  /**
   * Crea el formulario y activa la subscripcion a los cambios
   *  para validaciones y formatear la nueva fecha.
   */
   createForm() {
    this.form = new FormGroup({
      allSeller: new FormControl({ value: false, disabled: false }),
      email: new FormControl("", [Validators.required, Validators.email]),
      fromDate: new FormControl(this.fromDate),
      toDate: new FormControl(this.toDate),
      statusOrder: new FormControl([]),
    });

    this.formSubuscription = this.form.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((resp) => {
        this.maxToDate = moment(resp.fromDate).add(1, "month").toISOString();
        if (resp.allSeller === true) {
          this.arraySellerId = [];
          this.keywords = [];
        }
      });
  }

  /**
   * Llama el servicio que retorna todos los estados de ordenes
   */
  getSatatusOrders(): void {
    this.statusOrdersSvc.getIdOrders().subscribe((res) => {
      if ((res && res.status === 200) || res.status === 201) {
        this.listOrderStatus = res.body.data;
      }
    });
  }

  /**
   * funcion para agregar los seller id
   */

  saveKeyword() {
    this.keywords.push(this.seller.Name);
    this.arraySellerId.push(this.seller.IdSeller);
    this.IsClickEnable = false;
    this.clearSearch = true;
    if (this.form.controls.allSeller.value === true) {
      this.form.get("allSeller").setValue(false, { emitEvent: false });
    }
  }

  /**
   *
   * @param indexOfValue posicion del arreglo
   * Funcion para eliminar los seller id
   */

  deleteKeywork(indexOfValue: number): void {
    this.keywords.splice(indexOfValue, 1);
    this.arraySellerId.splice(indexOfValue, 1);
  }

  /**
   * Metodo para obtener información del usuario logueado
   */
  async getAllDataUser() {
    this.loadingService.viewSpinner();
    const sellerData = await this.profileService
      .getUser()
      .toPromise()
      .then((res) => {
        const body: any = res.body;
        const response = JSON.parse(body.body);
        const userData = response.Data;
        this.sellerId = userData.IdSeller;
        localStorage.setItem("typeProfile", userData.Profile);
        if (
          userData.Profile !== "seller" &&
          userData.Profile &&
          userData.Profile !== null
        ) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
        this.loadingService.closeSpinner();
        return userData;
      });
  }

  /**
   * funcion para exportar los contactos
   */

  sendExportReportOrders() {
    this.loadingService.viewSpinner();

    const body = {
      Status: this.form.value.statusOrder[0]
        ? this.form.value.statusOrder
        : null, //Si no selecciona ningun estado lo manda null
      DateInit: moment(this.form.value.fromDate).format("YYYY-MM-DD"),
      DateEnd: moment(this.form.value.toDate).format("YYYY-MM-DD"),
      Sellers: this.arraySellerId.length ? this.arraySellerId : null, //Si no selecciona Vendedor lo manda null
      Email: this.form.value.email,
      AllSeller: this.form.value.allSeller ? true : false, //Es false cuando selecciona al menos 1 vendedor, y true cuando no selecciona ninguno
    };

    this.sendReportSubscription = this.reportOrdersSvc
      .sendReportOrdersToEmail(body)
      .subscribe((res: any) => {
        if (res) {
          console.log(res);
          if (res.errors && res.errors.length > 0) {
            this.snackBar.open(
              this.translateService.instant(
                "secure.orders.send.error_ocurred_processing"
              ),
              this.translateService.instant("actions.close"),
              {
                duration: 3000,
              }
            );
          } else {
            this.snackBar.open(
              this.translateService.instant(
                "El reporte se ha enviado de manera correcta al correo solicitado"
              ),
              this.translateService.instant("actions.close"),
              {
                duration: 3000,
              }
            );
          }
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.closeSpinner();
          this.snackBar.open(
            this.translateService.instant(
              "secure.orders.send.error_ocurred_processing"
            ),
            this.translateService.instant("actions.close"),
            {
              duration: 3000,
            }
          );
        }
      });
  }

  ngOnDestroy() {
    if (this.InitialSubscription) {
      this.InitialSubscription.unsubscribe();
      this.IsClickEnable = false;
    }

    if (this.formSubuscription) {
      this.formSubuscription.unsubscribe();
    }

    if (this.sendReportSubscription) {
      this.sendReportSubscription.unsubscribe();
    }
  }
}
