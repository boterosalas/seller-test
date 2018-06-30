
/* 3rd party components */
import { NavigationStart, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

/* our own custom components */
import { environment } from './../../../../../environments/environment';
import { UserService } from '../../../../core/services/common/user/user.service';
import { User } from '../../../shared/models/login.model';
import { ShellComponent } from '../../../../core/shell/shell.component';
import { Logger } from '../../../../core/utilities/logger.service';

// log component
const log = new Logger('ProfileComponent');

/**
 * Component que permite visualizar la información del perfil del usuario
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Componente
 */
export class ProfileComponent implements OnInit {

  // user information
  user: User;
  // web url. empleada para saber cual es la url del servidor
  webUrl = environment.webUrl;

  /**
   * Creates an instance of ProfileComponent.
   * @param {ShellComponent} shellComponent 
   * @param {UserService} userService 
   * @memberof ProfileComponent
   */
  constructor(
    public shellComponent: ShellComponent,
    public userService: UserService
  ) {
    this.user = this.userService.getUser();
  }

  /**
   * @memberof ProfileComponent
   */
  ngOnInit() {
    // Valido si el usuario se encuentra logeado y puede ingresar a la vista.
    this.shellComponent.validateAccesUser().subscribe(res => {
      this.user = this.userService.getUser();
    }, err => {
      log.info("Error de autentificación", err)
    })
  }
}
