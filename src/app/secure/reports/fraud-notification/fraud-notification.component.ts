import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoadingService } from '@app/core';
import { SearchFormEntity, InformationToForm, ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { UploadFraudComponent } from './components/upload-fraud/upload-fraud.component';
import { FraudNotificationService } from './fraud-notification.service';

@Component({
  selector: 'app-fraud-notification',
  templateUrl: './fraud-notification.component.html',
  styleUrls: ['./fraud-notification.component.scss']
})
export class FraudNotificationComponent implements OnInit {

   // Configuración para el toolbar-options y el search de la pagina
   public informationToForm: SearchFormEntity = {
    title: 'Reportes',
    subtitle: 'menu.Notificación de Fraudes',
    btn_title: 'Reportes',
    title_for_search: 'Filtros reporte',
    type_form: 'fraud-notification',
    information: new InformationToForm,
    count: null,
  };

  @ViewChild('toolbarOptions', {static: false}) toolbarOption;

  // Evento que comunica al padre cuando tiene filtros.
  @Output() _fraudFilterEmit = new EventEmitter<any>();

  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    'name',
    'creationDate'
  ];

  dataSource:any;
  public paginationToken = '{}';
  public limit = 50;
  urlParams: string;

  constructor(
    public dialog: MatDialog,
    private _fraudService: FraudNotificationService,
    public componentsService: ComponentsService,
    private loadingService: LoadingService,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    this.getListFraud();
  }


 /**
   * Funcion para traer el listado de los fraudes
   * @memberof FraudNotificationComponent
   */
  getListFraud(applyPagination?: any, paramsFilter?: any) {
    let url;
    let urlFilters;
    this.loadingService.viewSpinner();

    if (applyPagination || paramsFilter) {
      url = paramsFilter ? `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}` : this.urlParams;
      if (paramsFilter) {
        urlFilters = {
            dateOrderInitial: paramsFilter.dateOrderInitial,
            dateOrderFinal: paramsFilter.dateOrderFinal,
            fileName: paramsFilter.fileName,
        };
      } else {
        urlFilters = {};
      }
    }else {
      url = `?limit=${this.limit}&paginationToken=${encodeURI(this.paginationToken)}`;
      urlFilters = {
      };
    }

    this._fraudFilterEmit.emit(urlFilters.PaymentNew);

    this._fraudService.getFraudList(url, urlFilters).subscribe((res: any) => {
        const { viewModel, count, paginationToken } = res;
        this.dataSource = viewModel;
        this.loadingService.closeSpinner();
        this.savePaginationToken(paginationToken);
    }, error => {
      this.loadingService.closeSpinner();
      this.componentsService.openSnackBar(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    });
  }

    /**
   * funcion para mostrar el modal de creacion de modulo
   *
   * @memberof FraudNotificationComponent
   */
     chargeFraud() {
      const dialog = this.dialog.open(UploadFraudComponent, {
        width: '800px',
        maxWidth: '90vw',
        maxHeight: '90vh',
      });
      const dialogIntance = dialog.componentInstance;
  
    }

    /**
   * funcion para salvar el token de la paginacion
   *
   * @param {string} paginationToken
   * @memberof FraudNotificationComponent
   */
  savePaginationToken(paginationToken: string) {
    if (paginationToken) {
      this.paginationToken = paginationToken;
    }
  }

  /**
  * Método para cambiar el page size de la tabla órdenes
  * @param {any} pageSize
  * @memberof ReportsComponent
  */
   changeSizeOrderTable($event) {

  }

}
