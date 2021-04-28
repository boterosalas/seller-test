import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
  }

  paginations (event: any) {

  }

  changeSizeOrderTable(even: any) {

  }

}
