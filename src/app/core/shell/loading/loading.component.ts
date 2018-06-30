/* 3rd party components */
import { Component, OnInit } from '@angular/core';

/* our own custom components */
import { Logger } from '../../utilities/logger.service';

// log component
const log = new Logger('ShellComponent');

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
  constructor() { }

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
    log.info('Loading Progress = true');
  }

  /**
   * Oculto el progressbar
   * @memberof LoadingComponent
   */
  closeLoadingProgressBar() {
    this.loadingProgressBar = false;
    log.info('Loading Progress = false');

  }

  /**
   * Muestro el spinner
   * @memberof LoadingComponent
   */
  viewLoadingSpinner() {
    this.loadingSpinner = true;
    log.info('Loading Spinner = true');

  }

  /**
   * Oculto el spinner
   * @memberof LoadingComponent
   */
  closeLoadingSpinner() {
    this.loadingSpinner = false;
    log.info('Loading Spinner = false');
  }

}
