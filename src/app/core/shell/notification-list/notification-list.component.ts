import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  showMore: boolean = false;
  sliceLimit: number = 2;

  notificationList = [
    { description: 'Tienes 10 reclamaciones pendientes' },
    { description: 'Tienes 6 órdenes sin guía' },
    { description: 'Tienes 10 reclamaciones pendientes' },
    { description: 'Tienes 6 órdenes sin guía' },
    { description: 'Tienes 10 reclamaciones pendientes' },
    { description: 'Tienes 6 órdenes sin guía' },
    { description: 'Tienes 10 reclamaciones pendientes' },
    { description: 'Tienes 6 órdenes sin guía' },
    { description: 'Tienes 10 reclamaciones pendientes' },
    { description: 'Tienes 6 órdenes sin guía' },
  ];

  constructor() { }

  ngOnInit() {
  }

  toggleShowMore() {
    if (this.showMore) {
      this.showMore = false;
      this.sliceLimit = 2;
      return;
    }
    this.showMore = true;
    this.sliceLimit = this.notificationList.length;
  }

}
