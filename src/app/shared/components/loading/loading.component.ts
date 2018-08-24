import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})

export class LoadingComponent implements OnInit {


  // Variable para el progress bar
  public loadingProgressBar = false;
  // Variable para el mat-spinner
  public loadingSpinner = false;


  /**
   * Creates an instance of LoadingComponent.
   * @memberof LoadingComponent
   */
  constructor() {
  }

  /**
   * @memberof LoadingComponent
   */
  ngOnInit() {
  }

  /**
   * Muestro el progressbar
   * @memberof LoadingComponent
   */
  viewLoadingProgressBar() {
    this.loadingProgressBar = true;
  }

  /**
   * Oculto el progressbar
   * @memberof LoadingComponent
   */
  closeLoadingProgressBar() {
    this.loadingProgressBar = false;
  }

  /**
   * Muestro el spinner
   * @memberof LoadingComponent
   */
  viewLoadingSpinner() {
    this.loadingSpinner = true;

  }

  /**
   * Oculto el spinner
   * @memberof LoadingComponent
   */
  closeLoadingSpinner() {
    this.loadingSpinner = false;
  }

}
