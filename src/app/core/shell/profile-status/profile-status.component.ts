import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-status',
  templateUrl: './profile-status.component.html',
  styleUrls: ['./profile-status.component.scss']
})
export class ProfileStatusComponent implements OnInit {

  currentState: string = 'Activo'
  scheduledVacation: string = '13/09/24';
  // scheduledVacation: string = '';

  constructor() { }

  ngOnInit() {
  }

}
