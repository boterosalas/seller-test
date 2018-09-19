import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { AwsUtil, CognitoUtil, LoadingService, LoggedInCallback, ModalComponent, ModalService, UserLoginService } from '@app/core';


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
  ) {
  }

  ngOnInit() {
    this.userService.isAuthenticated(this);
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
    const mythis = this;
    this.cognito.getIdToken({
      callback() {
      },
      callbackWithParam(token: any) {
        // Include the passed-in callback here as well so that it's executed downstream
        mythis.awsUtil.initAwsService(null, isLoggedIn, token);
      }
    });
  }
}

