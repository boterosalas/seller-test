import { Component, Input, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Logger } from '@app/core/util/logger.service';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { LoggedInCallback, UserLoginService, UserParametersService } from '@core/aws-cognito';
import { UserInformation } from '@app/shared';
import { MatDialog } from '@angular/material';
import { SupportModalComponent } from '@app/secure/support-modal/support-modal.component';
import { LoadingService } from '@app/core/global';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AVAILABLE_LENGUAGES, LanguageService } from '@app/core/language.service';
import { distinctUntilChanged } from 'rxjs/operators';


// log component
const log = new Logger('HeaderComponent');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, LoggedInCallback {

  // booleano para visualizar la barra de toolbar
  @Input() viewToolbarPrincipal: boolean;
  // Información del usuario
  @Input() user: UserInformation;
  // Sidenav principal
  @Input() sidenav;
  public userLoggin: boolean;
  public sellerName: any;
  public sellerId: any;
  public routes: any;
  public form: FormGroup;
  public languages = AVAILABLE_LENGUAGES;
  selectedLenguage: any;
  matSelect;

  constructor(
    private userService: UserLoginService,
    private userParams: UserParametersService,
    private router: Router,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private languageService: LanguageService
  ) { }

  /**
   * @memberof HeaderComponent
   */
  ngOnInit() {
    this.userService.isAuthenticated(this);
    this.initForm();
    this.matSelect = document.querySelector('.header_select>.mat-select-trigger>.mat-select-value');

  }

  private initForm() {
    this.form = this.fb.group({
      language: ['', Validators.required]
    });
    this.languageService.lenguage$.pipe(distinctUntilChanged()).subscribe((val) => {
      if (this.form.get('language').value !== val) {
        
      }
        this.form.get('language').setValue(val); 
        this.selectedLenguage = AVAILABLE_LENGUAGES.find(leng => leng.id === val);
        const spanValie = this.matSelect && this.matSelect.querySelector('.mat-select-value-text>span');
        console.log(spanValie, typeof spanValie);
        if (spanValie && this.selectedLenguage) {
          spanValie.setAttribute('text', this.selectedLenguage.render)
        }
    });
    this.form.get('language').valueChanges.subscribe((idLeng) => {
      this.languageService.setLenguage(idLeng);
      this.selectedLenguage = AVAILABLE_LENGUAGES.find(leng => leng.id === idLeng);
    });
  }

  async isLoggedIn(message: string, isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.user = await this.userParams.getUserData();
      this.routes = RoutesConst;
    }
  }

  goToHome() {
    if (this.user.sellerProfile === 'administrator') {
      this.router.navigate([`/${RoutesConst.sellerCenterIntSellerRegister}`]);
    } else if (this.user.sellerProfile === 'seller') {
      this.router.navigate([`/${RoutesConst.secureSeller}`]);
    }
  }

  /**
   * Funcionalidad que permite desplegar el menú.
   * @memberof HeaderComponent
   */
  toggleMenu() {
    this.sidenav.toggle();
  }

  openDialogSupport(): void {
    this.loadingService.viewProgressBar();
    const dialogRef = this.dialog.open(SupportModalComponent, {
      width: '90%',
      panelClass: 'full-width-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadingService.closeProgressBar();
    });
  }
}
