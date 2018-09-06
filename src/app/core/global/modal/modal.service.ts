import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';


@Injectable()
export class ModalService {
  private typeModal = new Subject<string>();

  /**
   * Notificaciones para abrir un tipo de modal.
   *
   * @returns {Observable<string>}
   */
  get modals(): Observable<string> {
    return this.typeModal.asObservable();
  }

  /**
   * Ordenar abrir una modal.
   *
   * @param {string} status
   */
  showModal(status: string) {
    this.typeModal.next(status);
  }
}
