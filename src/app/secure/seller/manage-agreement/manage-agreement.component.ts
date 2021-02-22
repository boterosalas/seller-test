import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Logger } from '@app/core';
import { ModalBulkloadAgreementComponent } from './modal-bulkload-agreement/modal-bulkload-agreement.component';

const log = new Logger('ManageAgreementComponent');

@Component({
  selector: 'app-manage-agreement',
  templateUrl: './manage-agreement.component.html',
  styleUrls: ['./manage-agreement.component.scss']
})
export class ManageAgreementComponent implements OnInit {

  manageAgreementsSeller = [
    {ContractName: 'Acuerdo 1'},
    {ContractName: 'Acuerdo 2'},
    {ContractName: 'Acuerdo 3'},
    {ContractName: 'Acuerdo 4'},
    {ContractName: 'Acuerdo 5'},
    {ContractName: 'Acuerdo 6'},
    {ContractName: 'Acuerdo 7'},
    {ContractName: 'Acuerdo 8'},
    {ContractName: 'Acuerdo 9'}
  ];

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  /**
   * Funcion para abrir modal para agregar masivamente acuerdos
   * @memberof ManageAgreementComponent
   */
  openModalBulkLoadAgreement() {
    const dialogRef = this.dialog.open(ModalBulkloadAgreementComponent, {
      width: '60%',
      minWidth: '280px',
      data: { }
    });
    dialogRef.afterClosed().subscribe(result => {
      log.info('The modal detail billing was closed');
    });
  }

}
