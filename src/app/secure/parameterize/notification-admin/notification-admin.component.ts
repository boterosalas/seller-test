import { Component, OnInit } from '@angular/core';
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
    this.getAllAdvertisements();
  }

  getAllAdvertisements() {
    const params = '?limit=' + this.limit + '&paginationToken=' + this.paginationToken;
    this.loadingService.viewSpinner();
    this.notificationAdminService.getAllNotification(params).subscribe(result => {
      if (result && result.status === 200 && result.body) {
        const body = result.body;
        this.dataSource = new MatTableDataSource(body.ViewModel);
        if (this.onlyOne) {
          this.length = body.Count;
        }
        this.onlyOne = false;
        this.loadingService.closeSpinner();
      }
    });
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
    console.log(event);
    event.showPreview = showPreview;
    const dialogRef = this.dialog.open(ModalPreviewNotificationComponent, {
      width: '58%',
      data: event,
    });
  }

  paginations(event: any) { }
  changeSizeOrderTable(even: any) { }

}
