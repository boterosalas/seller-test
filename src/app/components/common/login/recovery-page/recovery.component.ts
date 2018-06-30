
/* 3rd party components */
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms/src/model';

/* our own custom components */
import { ComponentsService } from '../../../../core/services/common/components/components.service';
import { LoginService } from '../login.service';
import { ShellComponent } from '../../../../core/shell/shell.component';

/**
 * Componente para realizar la recuperación de la contraseña del usuario.
 */
@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
  animations: [
    trigger('shrinkOut', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.5s ease-in')
      ]),
      transition('* => void', [
        animate('0.5s 0.1s ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ]),
    trigger('scaleEfect', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.2s ease-in')
      ]),
      transition('* => void', [
        animate('0.2s 0.1s ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ]
})

/**
 * Componente de recuperación de contraseña
 */
export class RecoveryComponent implements OnInit {

  // Formulario de recuperación de contraseña
  @ViewChild('form') myNgForm;
  // Formulario de recuperación
  myform: FormGroup;

  /**
   * Creates an instance of RecoveryComponent.
   * @param {FormBuilder} fb
   * @param {ComponentsService} componentService
   * @param {LoginService} login
   * @param {ShellComponent} shellComponent
   * @memberof RecoveryComponent
   */
  constructor(
    private fb: FormBuilder,
    private componentService: ComponentsService,
    private login: LoginService,
    private shellComponent: ShellComponent) {
  }

  /**
   * ngOnInit
   * @memberof RecoveryComponent
   */
  ngOnInit() {
    this.createForm();
  }

  /**
   * Creación del controlador para las validaciones del formulario
   * @memberof RecoveryComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.email])],
    });
  }

  /**
   * Creación del método para realizar el consumo del servicio de recuperación de contraseña
   * @param {any} data
   * @memberof RecoveryComponent
   */
  recoveryPassword(data) {
    const information = data.value;
    this.shellComponent.loadingComponent.viewLoadingProgressBar();
    this.login.recoveryPassword(information).subscribe((res: any) => {
      if (res != null) {
        /* limpio formulario */
        this.myform.setValue({
          email: '',
        });
        this.myform.reset();
        this.myNgForm.resetForm();
        this.shellComponent.loadingComponent.closeLoadingProgressBar();
        this.componentService.openSnackBar(res.message, 'Aceptar');
      } else {
        this.shellComponent.loadingComponent.closeLoadingProgressBar();
        this.componentService.openSnackBar('Tu usuario no existe', 'Aceptar');
      }
    }, err => {
      this.viewErrorMessageLogin(err);
    });
  }

  /**
   * Método para visualizar el log de error en el servicio
   * @param {any} [err]
   * @memberof RecoveryComponent
   */
  viewErrorMessageLogin(err?) {
    this.shellComponent.loadingComponent.closeLoadingProgressBar();
    if (err.error_description === '' || err.error_description === undefined) {
      err.error_description = 'Se ha presentado un error al iniciar sesión';
    }
    this.componentService.openSnackBar(err.error_description, 'Aceptar');
  }

}
