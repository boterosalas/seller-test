import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoadingService, Logger } from "@app/core";
import { SearchFormEntity } from "@app/shared";
import { ShellComponent } from "../..";
import { SearchOrderMenuService } from "../search-order-menu.service";
import * as _ from "lodash";

// log component
const log = new Logger("SearchFraudFormComponent");

interface DataForm {
  fileName?: string;
  dateOrderInitial?: Date | string;
  dateOrderFinal?: Date | string;
}

@Component({
  selector: "app-search-fraud-notification-form",
  templateUrl: "./search-fraud-notification-form.component.html",
  styleUrls: ["./search-fraud-notification-form.component.scss"],
})
export class SearchFraudNotificationFormComponent implements OnInit {
  // Formulario para realizar la busqueda
  myform: FormGroup;
  // user info
  public user: any;
  // Configuración para el formato de fecha
  locale = "es-CO";
  // Variable que almacena los datos que se le pueden pasar al formulario
  @Input() informationToForm: SearchFormEntity;

  @Input() idSeller: number;
  @Input() paginator: any;

  /**
   * Creates an instance of SearchOrderFormComponent.
   * @param {UserService} userService
   * @param {ComponentsService} componentsService
   * @param {Router} route
   * @param {SearchOrderMenuService} SearchOrderMenuService
   * @param {ShellComponent} shellComponent
   * @param {FormBuilder} fb
   * @memberof SearchOrderFormComponent
   */
  constructor(
    private fb: FormBuilder,
    private shellComponent: ShellComponent,
    private __loadingService: LoadingService,
    private __searchOrderMenuService: SearchOrderMenuService
  ) { }

  /**
   * ngOnInit
   * @memberof SearchOrderFormComponent
   */
  ngOnInit() {
    // Obtengo la información del usuario
    // this.user = this.userService.getUser();
    this.createForm();
  }

  /**
   * Método para crear el formulario
   * @memberof SearchOrderFormComponent
   */
  createForm() {
    // Estructura para los datos del formulario de consulta.
    this.myform = this.fb.group({
      dateOrderInitial: [null, Validators.compose([])],
      dateOrderFinal: [null, Validators.compose([])],
      fileName: [
        null,
        Validators.compose([Validators.minLength(1), Validators.maxLength(30)]),
      ],
    });
  }

  /**
   * Método para limpiar el formulario
   *
   * @memberof SearchOrderFormComponent
   */
  clearForm() {
    this.myform.reset();
    this.shellComponent.eventEmitterOrders.fraudList.emit();
    this.filterFrauds(this.myform);
  }

  /**
   * Método para desplegar el menú
   * @memberof SearchOrderFormComponent
   */
  toggleMenu() {
    this.shellComponent.sidenavSearchOrder.toggle();
  }

  /**
   * Método para obtener las órdenes
   * @param {any} state
   * @memberof SearchOrderFormComponent
   */
  getOrderList(state: any) {
    this.shellComponent.eventEmitterOrders.filterFraudList(state);
  }

  /**
   * Metodo para filtrar fraudes segun los campos completados
   *
   * @param {FormGroup} myform
   * @memberof SearchFraudNotificationFormComponent
   */
  public filterFrauds(myform: FormGroup) {
    let { dateOrderInitial, dateOrderFinal, fileName }: DataForm = myform.value;

    // Obtengo la información del usuario
    const datePipe = new DatePipe(this.locale);

    // aplico el formato para la fecha a emplear en la consulta
    dateOrderFinal = datePipe.transform(dateOrderFinal, "yyyy/MM/dd");
    dateOrderInitial = datePipe.transform(dateOrderInitial, "yyyy/MM/dd");

    let stringQuery = "";
    const objectQuery: DataForm = {};

    if (dateOrderInitial !== null && dateOrderInitial !== "") {
      stringQuery += `&dateOrderInitial=${dateOrderInitial}`;
      objectQuery.dateOrderInitial = dateOrderInitial;
    }

    if (dateOrderFinal !== null && dateOrderFinal !== "") {
      stringQuery += `&dateOrderFinal=${dateOrderFinal}`;
      objectQuery.dateOrderFinal = dateOrderFinal;
    }

    if (fileName !== null && fileName !== "") {
      stringQuery += `&fileName=${fileName}`;
      objectQuery.fileName = fileName;
    }

    stringQuery += "&paginationToken=" + encodeURI("{}");
    // Guardo el filtro aplicado por el usuario.
    this.__searchOrderMenuService.setCurrentFilterOrders(this.myform.value);
    this.__loadingService.viewSpinner();
    this.__searchOrderMenuService
      .getFraudList(`?limit=${50}`, stringQuery)
      .subscribe((data) => {
        console.log(data);
        if (data) {
          this.shellComponent.eventEmitterOrders.filterParams.emit(stringQuery);
          const pagToken = data['paginationToken'];
          const paramsFilter = {
            'dateOrderFinal': dateOrderFinal,
            'dateOrderInitial': dateOrderInitial,
            'fileName': fileName,
            'paginationToken': pagToken
          };
          // indico a los elementos que esten suscriptos al evento.
          const allData = {
            'data': data,
            'paramsFilter': paramsFilter
          };
          this.shellComponent.eventEmitterOrders.filterFraudList(allData);
          this.shellComponent.sidenavSearchOrder.toggle();
          this.__loadingService.closeSpinner();
        }
      });

    console.log(66, stringQuery);
  }
}
