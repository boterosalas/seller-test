import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AwsUtil, CognitoUtil, LoadingService, LoggedInCallback, Logger, ModalComponent, ModalService, UserLoginService } from '@app/core';
import { environment } from '@env/environment';

const log = new Logger('AppComponent');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class AppComponent implements OnInit, AfterViewChecked, LoggedInCallback {
  // Controla para el progress bar
  progressBar = false;
  // Controla para el mat-spinner
  spinner = false;

  @ViewChild(ModalComponent) private modalComponent: ModalComponent;

  constructor(
    private awsUtil: AwsUtil,
    private userService: UserLoginService,
    private cognito: CognitoUtil,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    //toolbar position

    window.onscroll = function() {
      toolbarTop()
    };

    function toolbarTop() {

      const classtop = document.querySelector('.toolbar-component');
      const classtop2 = document.querySelector('.tree-toolbar');
      // const secondTool= document.querySelector('.toolbar-component');
      if(classtop){
        if(window.scrollY > 45){
          classtop.classList.add("top-toolbar");
        } else {
          classtop.classList.remove("top-toolbar");
        }
      }

      if(classtop2){
        if(window.scrollY > 45){
          classtop2.classList.add("top-toolbar");
        } else {
          classtop2.classList.remove("top-toolbar");
        }
      }

    }
      
    // Configurar logs.
    if (environment.production) {
      Logger.enableProductionMode();
    }
    // Validar autenticación.
    this.userService.isAuthenticated(this);
    // Escuchar eventos para abrir la modal global.
    this.modalService.modals.subscribe(type => {
      setTimeout(() => {
        this.modalComponent.showModal(type);
      });
    });
  }

  ngAfterViewChecked() {
    this.loadingService.spinnerStatus.subscribe(state => {
      this.spinner = state;
    });
    this.loadingService.progressBarStatus.subscribe(state => {
      this.progressBar = state;
    });
    this.cdRef.detectChanges();
  }

  isLoggedIn(message: string, isLoggedIn: boolean) {
    const self = this;
    this.cognito.getIdToken({
      callback() {
      },
      callbackWithParam(token: any) {
        // Include the passed-in callback here as well so that it's executed downstream
        self.awsUtil.initAwsService(null, isLoggedIn, token);
      }
    });
  }

 
}

