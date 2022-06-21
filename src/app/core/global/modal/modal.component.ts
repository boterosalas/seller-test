import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})

export class ModalComponent implements OnInit {

  public message: string;
  public status: string;
  public title: string;

  constructor(
    public dialog: MatDialog,
    private languageService: TranslateService
  ) {
  }

  ngOnInit() {
  }

  /**
   * showModal método para mostrar el modal.
   *
   * @param status
   * @memberof ModalComponent
   */
  showModal(status: string) {
    let dataModal: any;
    const dialogRef = this.dialog.open(ModalComponent, {
      height: '473px',
      width: '760px'
    });
    switch (status) {
      case 'success':
        dataModal = {
          'status': 'done',
          'message': this.languageService.instant('modal.success.register'),
          'title': this.languageService.instant('modal.success.register title')
        };
        break;
      case 'error':
        dataModal = {
          'status': 'clear',
          'message': this.languageService.instant('modal.fail.register'),
          'title': this.languageService.instant('modal.fail.register.title')
        };
        break;
        case 'errorSELLER_ID_OCTOPIA':
          dataModal = {
            'status': 'clear',
            'message': this.languageService.instant('modal.fail.errorSELLER_ID_OCTOPIA'),
            'title': this.languageService.instant('modal.fail.register.title')
          };
          break;
      case 'errorService':
        dataModal = {
          'status': 'clear',
          'message': this.languageService.instant('modal.problems'),
          'title': this.languageService.instant('modal.problems.title')
        };
        break;
      case 'soldOut':
        dataModal = {
          'status': 'clear',
          'message': this.languageService.instant('modal.product.no_stock'),
          'title': this.languageService.instant('modal.problems.title')
        };
        break;
      case 'successUpdate':
        dataModal = {
          'status': 'done',
          'message': this.languageService.instant('modal.success.update'),
          'title': this.languageService.instant('modal.success.update.title')
        };
        break;
    }
    dialogRef.componentInstance.status = dataModal.status;
    dialogRef.componentInstance.message = dataModal.message;
    dialogRef.componentInstance.title = dataModal.title;
  }

  /**
   * Método para recargar la página.
   *
   * @method reloadPage
   * @memberof ModalComponent
   */
  reloadPage() {
    window.location.reload();
  }

}

