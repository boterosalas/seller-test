import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { UploadFraudComponent } from './components/upload-fraud/upload-fraud.component';

@Component({
  selector: 'app-fraud-notification',
  templateUrl: './fraud-notification.component.html',
  styleUrls: ['./fraud-notification.component.scss']
})
export class FraudNotificationComponent implements OnInit {

   // Configuración para el toolbar-options y el search de la pagina
   public informationToForm: SearchFormEntity = {
    title: 'Reportes',
    subtitle: 'menu.Notificación de Fraudes',
    btn_title: 'Reportes',
    title_for_search: 'Filtros reporte',
    type_form: 'fraud-notification',
    information: new InformationToForm,
    count: null,
  };

  @ViewChild('toolbarOptions', {static: false}) toolbarOption;

  // Columnas que se visualizan en la tabla
  public displayedColumns = [
    'name',
    'creationDate',
    'fileDownload',
  ];

  dataSource:any;

   ELEMENT_DATA: any[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  ];
  

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.dataSource = this.ELEMENT_DATA;
  }

    /**
   * funcion para mostrar el modal de creacion de modulo
   *
   * @memberof ListAdminSchoolComponent
   */
     chargeFraud() {
      const dialog = this.dialog.open(UploadFraudComponent, {
        width: '800px',
        maxWidth: '90vw',
        maxHeight: '90vh',
      });
      const dialogIntance = dialog.componentInstance;
  
    }

}
