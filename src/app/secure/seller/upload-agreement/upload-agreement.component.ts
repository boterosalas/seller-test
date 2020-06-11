import { Component, OnInit, ViewChild } from '@angular/core';
import { StoresService } from '@app/secure/offers/stores/stores.service';
import { Logger, LoadingService, ModalService } from '@app/core';
import { MatSnackBar, PageEvent, MatSidenav, ErrorStateMatcher, MatChipInputEvent, MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { RoutesConst, SearchFormEntity, InformationToForm } from '@app/shared';
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { trimField } from '../../../shared/util/validation-messages';

import { AuthService } from '@app/secure/auth/auth.routing';
import { MenuModel, readFunctionality, visualizeFunctionality, enableFunctionality, sellerListName, disableFunctionality, vacationFunctionality, cancelVacacionFunctionality } from '@app/secure/auth/auth.consts';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { DateService } from '@app/shared/util/date.service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { SelectionModel } from '@angular/cdk/collections';

const log = new Logger('ManageSellerComponent');
@Component({
  selector: 'app-upload-agreement',
  templateUrl: './upload-agreement.component.html',
  styleUrls: ['./upload-agreement.component.scss']
})
export class UploadAgreementComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;
  public dataSource: MatTableDataSource<any>;
  public selection = new SelectionModel<any>(true, []);
  public initialSellerList: any;
  public mapInitialSellerList: any;
  public length = 0;
  public displayedColumns = [
    'All',
    'Id',
    'Nit',
    'nameSeller',
  ];

   // Configuración para el toolbar-options y el search de la pagina
   public informationToForm: SearchFormEntity = {
    title: 'secure.seller.list.toolbar_title',
    subtitle: 'menu.Cargar Acuerdos',
    btn_title: 'secure.orders.filter.title',
    title_for_search: 'secure.orders.filter.title',
    type_form: 'orders',
    information: new InformationToForm,
    count: null
  };

  constructor(

    private storesService: StoresService,
        private loading: LoadingService,
        private snackBar: MatSnackBar,
        private router: Router,
        private fb: FormBuilder,
        private dialog: MatDialog,
        public authService: AuthService,
        private modalService: ModalService,
        private languageService: TranslateService
  ) { }

  ngOnInit() {
    this.getAllSeller();
  }

  getAllSeller() {
    this.storesService.getAllStoresFull(null).subscribe((result: any) => {
      if (result && result.status === 200) {
        if (result && result.body && result.body.body) {
          const body = JSON.parse(result.body.body);
          this.initialSellerList = JSON.parse(result.body.body).Data;
          console.log(this.initialSellerList);
          this.dataSource = new MatTableDataSource([
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
            {'IdSeller': '1234567', 'Nit': '123456', 'Name': 'prueba cargar' },
          ]);
          // if (JSON.stringify(this.initialSellerList) !== '{}') {
            // this.mapInitialSellerList = this.mapItems(this.initialSellerList);
            // this.dataSource = new MatTableDataSource(this.initialSellerList);
          //   this.length = this.initialSellerList.length;
          //   console.log(this.dataSource);
          // }
        }

      } else {
        log.error('Error al cargar los vendendores: ', result);
       }
    });
  }

}
