/* 3rd party components */
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/* our own custom components */
import { User } from '../../../shared/models/login.model';
import { ComponentsService } from '../../../../core/services/common/components/components.service';
import { UserService } from '../../../../core/services/common/user/user.service';
import { Logger } from '../../../../core/utilities/logger.service';

// log component
const log = new Logger('EditPasswordComponent');

/**
 * Component que permite realizar la edicción de la contraseña del usuario
 */
@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})


export class EditPasswordComponent implements OnInit {

  //  Formulario de edicció de contraseña
  myform: FormGroup;
  // Información del usuario
  user: User;

  /**
   * Creates an instance of EditPasswordComponent.
   * @param {FormBuilder} fb 
   * @param {ComponentsService} componentService 
   * @param {UserService} userService 
   * @memberof EditPasswordComponent
   */
  constructor(
    private fb: FormBuilder,
    public componentService: ComponentsService,
    public userService: UserService
  ) {
  }

  /**
   * ngOnInit
   * @memberof EditPasswordComponent
   */
  ngOnInit() {
    this.user = this.userService.getUser();
    this.createForm();
  }

  /**
   * Método para crear el formulario
   * @memberof EditPasswordComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'pwd': [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(20)])],
      'confirmpwd': [null, Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(20)])],
    });
  }

  /**
   * Método para cambiar la contraseña
   * @param {any} data 
   * @memberof EditPasswordComponent
   */
  changePassword(data) {
    log.info(data)
  }
}
