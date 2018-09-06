import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';


@Injectable()
export class LoadingService {
  private progressBar = new Subject<boolean>();
  private spinner = new Subject<boolean>();

  /**
   * Estado del spinner.
   *
   * @returns {Observable<boolean>}
   */
  get spinnerStatus(): Observable<boolean> {
    return this.spinner.asObservable();
  }

  /**
   *  Estado de la barra de progreso.
   *
   * @returns {Observable<boolean>}
   */
  get progressBarStatus(): Observable<boolean> {
    return this.progressBar.asObservable();
  }

  /**
   * Mostrar el progressbar.
   *
   * @memberof LoadingService.
   *
   */
  viewProgressBar() {
    this.progressBar.next(true);
  }

  /**
   * Ocultar el progressbar.
   *
   * @memberof LoadingService
   */
  closeProgressBar() {
    this.progressBar.next(false);
  }

  /**
   * Mostrar el spinner.
   *
   * @memberof LoadingService
   */
  viewSpinner() {
    this.spinner.next(true);
  }

  /**
   * Ocultar el spinner.
   *
   * @memberof LoadingService
   */
  closeSpinner() {
    this.spinner.next(false);
  }
}
