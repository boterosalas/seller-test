import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSidenav, ErrorStateMatcher, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
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
  @ViewChild('toolbarOptions', {static: false}) toolbarOption;
  public filter: any;

  public limit = 50;
  public paginationToken = encodeURI('{}');

  public mockList = {
    'Errors': [],
    'Data': [
      {
        'Title': 'Test Esteban',
        'CreationDate': '2021-03-24T05:46:25.145-05:00',
        'InitialDate': '2021-03-19T00:00:00-05:00',
        'FinalDate': null,
        'Body': null,
        'UrlImage': null,
        'BackgroundColor': null,
        'Target': 'International',
        'Available': false,
        'Link': null,
        'Id': 637521795851451149,
        'IsNew': false,
        'NewInitialDate': null
      },
      {
        'Title': 'Test Esteban',
        'CreationDate': '2021-03-24T05:46:25.145-05:00',
        'InitialDate': '2021-03-19T00:00:00-05:00',
        'FinalDate': null,
        'Body': null,
        'UrlImage': null,
        'BackgroundColor': null,
        'Target': 'International',
        'Available': false,
        'Link': null,
        'Id': 637521795851451149,
        'IsNew': false,
        'NewInitialDate': null
      },
      {
        'Title': 'Test Esteban',
        'CreationDate': '2021-03-24T05:46:25.145-05:00',
        'InitialDate': '2021-03-19T00:00:00-05:00',
        'FinalDate': null,
        'Body': null,
        'UrlImage': null,
        'BackgroundColor': null,
        'Target': 'International',
        'Available': false,
        'Link': null,
        'Id': 637521795851451149,
        'IsNew': false,
        'NewInitialDate': null
      }
    ],
    'Message': ''
  };

  constructor(
    private notificationAdminService: NotificationAdminService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.filter = {
      'PaginationToken': '{}',
      'limit': this.limit,
    };
    this.arrayPosition = [];
    this.arrayPosition.push('{}');
    this.getAllAdvertisements();
  }

  getAllAdvertisements() {
    const params = '?limit=' + this.limit + '&paginationToken=' + encodeURI(this.paginationToken);
    this.loadingService.viewSpinner();
    this.notificationAdminService.getAllNotification(params).subscribe(result => {
      if (result && result.status === 200 && result.body) {
        const body = result.body;
        this.dataSource = new MatTableDataSource(body.ViewModel);
        if (this.onlyOne) {
          this.length = body.Count;
        }
        this.savePaginationToken(body.PaginationToken);
        this.onlyOne = false;
        this.loadingService.closeSpinner();
      }
    });
  }

  savePaginationToken(pagination: string) {
    const isExist = this.arrayPosition.includes(pagination);
    if (isExist === false) {
      this.arrayPosition.push(pagination);
    }
  }

  createNotification() {
    this.paramsNotification = {
      isEdit: false,
      notification: null
    };
    this.showListAdvertisements = false;
    this.showContainerDetail = true;
  }

  backList(event: any) {
    this.showListAdvertisements = event && event.back ? event.back : false;
  }
  edit(event: any, isEdit: boolean) {
    this.paramsNotification = {
      isEdit: true,
      notification: event
    };
    this.showListAdvertisements = false;
    this.showContainerDetail = true;
  }

  refreshData(event: any) {
    this.showListAdvertisements = true;
    this.showContainerDetail = false;
    this.getAllAdvertisements();
  }

  deleteNotification(element: any) {
    const title = '¡Vas a eliminar un anuncio!';
    const params = {
      createOrEdit: false,
      isEdit: false,
      title: title,
      subTitle: 'Se eliminaran anuncio de tu base de datos ¿Estas seguro de eliminar el anuncio?'
    };
    const dialogRef = this.dialog.open(ModalGenericComponent, {
      width: '50%',
      data: params,
    });
  }
  preview(event: any, showPreview: boolean) {
    event.showPreview = showPreview;
    const dialogRef = this.dialog.open(ModalPreviewNotificationComponent, {
      width: '58%',
      data: event,
    });
  }

  paginations(event: any) {
    const newLimit = event.param.pageSize;
    const index = event.param.pageIndex;
    if (newLimit !== this.limit)  {
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
  changeSizeOrderTable(even: any) { }

}
