import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent implements OnInit {
  // Variable para el progress bar
  @Input() progressBar = false;
  // Variable para el mat-spinner
  @Input() spinner = false;

  constructor() {
  }

  ngOnInit() {
  }

}
