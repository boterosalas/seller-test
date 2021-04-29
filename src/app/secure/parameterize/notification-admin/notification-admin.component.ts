import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatSidenav, ErrorStateMatcher, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-notification-admin',
  templateUrl: './notification-admin.component.html',
  styleUrls: ['./notification-admin.component.scss']
})
export class NotificationAdminComponent implements OnInit {
  
  public downloadPermission = false;
  public btnFilter = true;
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






  constructor() { }

  ngOnInit() {
    this.getAllAdvertisements();
  }

  getAllAdvertisements() {
    this.dataSource = new MatTableDataSource(this.mockList.Data);
  }

  createNotification() {
    this.showListAdvertisements = false;
    this.showContainerDetail = true;
  }

  backList(event: any) {
    this.showListAdvertisements = event && event.back ? event.back : false;
  }

  paginations (event: any) {}
  changeSizeOrderTable(even: any) {}

}
