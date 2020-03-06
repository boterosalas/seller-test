import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchFormEntity, InformationToForm } from '@app/shared';
import { MatSidenav, MatSnackBar, MatTableDataSource } from '@angular/material';
import { PortCollectionService } from './port-collection.service';
import { LoadingService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.scss']
})
export class PortComponent implements OnInit {

  @ViewChild('sidenavSearchOrder') sidenavSearchOrder: MatSidenav;

  public stateSideNavOrder = false;
  public dataSource: MatTableDataSource<any>;

  public displayedColumns = [
    'port',
    'country',
    'collection_center',
    'address',
    'action',
    'apply',
  ];

  // Configuración para el toolbar-options y el search de la pagina
  public informationToForm: SearchFormEntity = {
    title: 'module.Parametrización',
    subtitle: 'menu.Parametrizar Centros de Acopio',
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'orders',
    information: new InformationToForm,
    count: null
  };

  constructor(
    private portCollectionService: PortCollectionService,
    private loadingService: LoadingService,
    private languageService: TranslateService,
    public snackBar?: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getAllCenterCollection();
  }

  getAllCenterCollection() {
    this.portCollectionService.getAllPort().subscribe((res: any) => {
      if (res) {
        this.dataSource = new MatTableDataSource(res);
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.snackBar.open(this.languageService.instant('secure.orders.send.error_ocurred_processing'), this.languageService.instant('actions.close'), {
        duration: 3000,
      });
    });
  }

  toggleFilterPorts() {
    this.sidenavSearchOrder.toggle();
  }

}
