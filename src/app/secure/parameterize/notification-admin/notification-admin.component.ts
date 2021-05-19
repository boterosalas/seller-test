import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { LoadingService } from '@app/core';
import { ModalGenericComponent } from './component/modal-generic/modal-generic.component';
import { ModalPreviewNotificationComponent } from './component/modal-preview-notification/modal-preview-notification.component';
import { NotificationAdminService } from './notification-admin.service';

@Component({
  selector: 'app-notification-admin',
  templateUrl: './notification-admin.component.html',
  styleUrls: ['./notification-admin.component.scss']
})
export class NotificationAdminComponent implements OnInit {

  public downloadPermission = false;
  public btnFilter = false;
  public btnDownload = false;
  public typeProfile = 3;
  public length = [];
  public isClear = false;
  public isFullSearch = false;
  public informationToForm: any = {
    title: 'module.Parametrización',
    subtitle: 'menu.Notificación',
    btn_title: '',
    title_for_search: 'secure.notifications.container.title_for_search',
    type_form: 'notification',
  };

  public displayedColumns = [
    'title',
    'date',
    'actions'
  ];
  public dataSource: MatTableDataSource<any>;
  public showListAdvertisements = true;
  public showContainerDetail = false;
  public paramsNotification: any;
  public onlyOne = true;
  public arrayPosition = [];
  public indexPage = 0;
  public filter: any;
  public limit = 50;
  public paginationToken = encodeURI('{}');
  public notification: any;
  @ViewChild('toolbarOptions', { static: false }) toolbarOption;

  constructor(
    private notificationAdminService: NotificationAdminService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    public snackBar?: MatSnackBar,
  ) {
    window.scroll(0, 0);
  }

  ngOnInit() {
    this.setInitVar();
    this.getAllAdvertisements();
  }
  /**
   * funcion para setear variables iniciales y posicion del scroll
   *
   * @memberof NotificationAdminComponent
   */
  setInitVar() {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 500);
    this.filter = {
      'PaginationToken': '{}',
      'limit': this.limit,
    };
    this.arrayPosition = [];
    this.arrayPosition.push('{}');
  }
  /**
   * funcion para consultar todos los anuncios creados
   *
   * @memberof NotificationAdminComponent
   */
  getAllAdvertisements() {
    window.scroll(0, 0);
    const params = '?limit=' + this.limit + '&paginationToken=' + encodeURI(this.paginationToken);
    this.loadingService.viewSpinner();
    this.notificationAdminService.getAllNotification(params).subscribe(result => {
      if (result && result.status === 200 && result.body) {
        const body = result.body;
        this.dataSource = new MatTableDataSource(body.ViewModel);
        console.log(this.dataSource);
        if (this.onlyOne) {
          this.length = body.Count;
        }
        this.savePaginationToken(body.PaginationToken);
        this.onlyOne = false;
        this.loadingService.closeSpinner();
      }
    });
  }
  /**
   * funcion para salvar en el un arreglo los diferentes paginationtoken de la paginacion
   *
   * @param {string} pagination
   * @memberof NotificationAdminComponent
   */
  savePaginationToken(pagination: string) {
    const isExist = this.arrayPosition.includes(pagination);
    if (isExist === false) {
      this.arrayPosition.push(pagination);
    }
  }
  /**
   * funcion para crear las notificaciones
   *
   * @memberof NotificationAdminComponent
   */
  createNotification() {
    this.paramsNotification = {
      isEdit: false,
      notification: null
    };
    this.showListAdvertisements = false;
    this.showContainerDetail = true;
  }
  /**
   * funcion para devolver al listado principal de anuncios
   *
   * @param {*} event
   * @memberof NotificationAdminComponent
   */
  backList(event: any) {
    window.scroll(0, 0);
    this.showListAdvertisements = event && event.back ? event.back : false;
  }
  /**
   * funcion para editar los anuncios
   *
   * @param {*} event
   * @param {boolean} isEdit
   * @memberof NotificationAdminComponent
   */
  edit(event: any, isEdit: boolean) {
    this.paramsNotification = {
      isEdit: true,
      notification: event
    };
    this.showListAdvertisements = false;
    this.showContainerDetail = true;
  }
  /**
   * funcion para refrescar la data que se visualiza en el listado principal
   *
   * @param {*} event
   * @memberof NotificationAdminComponent
   */
  refreshData(event: any) {
    this.showListAdvertisements = true;
    this.showContainerDetail = false;
    this.getAllAdvertisements();
    setTimeout(() => {
      window.scroll(0, 0);
    }, 400);
  }
  /**
   * funcuion para eliminar anuncios, llama al modal para confirmar 
   *
   * @param {*} element
   * @memberof NotificationAdminComponent
   */
  deleteNotification(element: any) {
    this.notification = element;
    const title = '¡Vas a eliminar un anuncio!';
    const subTitle = 'Se eliminaran anuncio de tu base de datos ¿Estas seguro de eliminar el anuncio?';
    const params = {
      success: {
        createOrEdit: false,
        isEdit: false,
        title: null,
      },
      error: {
        isError: false,
        listError: null,
        titleErrorSubtitle: null
      },
      delete: {
        isDelete: true,
        title: title,
        subTitle: subTitle
      },
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      width: '50%',
      data: params,
    });

    const dialogIntance = dialogRef.componentInstance;
    dialogIntance.delete$.subscribe((val) => {
      this.notificationDelete(element.Id, dialogIntance);
    });
  }
  /**
   * funcion para borrar el anuncion 
   *
   * @param {*} id
   * @param {*} dialog
   * @memberof NotificationAdminComponent
   */
  notificationDelete(id: any, dialog: any) {
    this.loadingService.viewSpinner();
    const idNotification = '?id=' + id;
    this.notificationAdminService.deleteNotification(idNotification).subscribe(result => {
      if (result && result.Data) {
        this.getAllAdvertisements();
        const msg = 'Se eliminó el anuncio correctamente';
        this.snackBar.open(msg, 'Cerrar', {
          duration: 3000
        });
      } else {
        this.loadingService.closeSpinner();
        const msg = 'Se ha presentado un error al tratar de eliminar el anuncio';
        this.snackBar.open(msg, 'Cerrar', {
          duration: 3000
        });
      }
      dialog.close();
    });
  }
  /**
   * funcion para previsualizar el anuncion por medio de una modal
   *
   * @param {*} event
   * @param {boolean} showPreview
   * @memberof NotificationAdminComponent
   */
  preview(event: any, showPreview: boolean) {
    event.showPreview = showPreview;
    const dialogRef = this.dialog.open(ModalPreviewNotificationComponent, {
      width: '58%',
      data: event,
    });
  }
  /**
   * funcion para paginar el listado de anuncios
   *
   * @param {*} event
   * @memberof NotificationAdminComponent
   */
  paginations(event: any) {
    const newLimit = event.param.pageSize;
    const index = event.param.pageIndex;
    if (newLimit !== this.limit) {
      this.indexPage = 0;
      this.limit = event.param.pageSize;
      this.filter.PaginationToken = '{}';
      this.filter.Limit = this.limit;
      this.filter.CurrentPage = 0;
      const paginator = this.toolbarOption.getPaginator();
      paginator.pageIndex = 0;
      this.arrayPosition = [];
      this.arrayPosition.push('{}');
      this.paginationToken = '{}';
    } else {
      let newPaginationToken = this.arrayPosition[index];
      if (newPaginationToken === undefined) {
        newPaginationToken = '{}';
        this.paginationToken = '{}';
      }
      this.filter.PaginationToken = newPaginationToken;
      this.paginationToken = newPaginationToken;
      this.limit = newLimit;
    }
    this.getAllAdvertisements();
  }
}
