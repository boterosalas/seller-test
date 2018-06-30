/* 3rd party components */
import { Router, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/* our own custom components */
import { User } from '../../../shared/models/login.model';
import { UserService } from '../../../../core/services/common/user/user.service';
import { ComponentsService } from '../../../../core/services/common/components/components.service';
import { Logger } from '../../../../core/utilities/logger.service';

// log component
const log = new Logger('EditProfileComponent');

/**
 * Component que permite realizar la edicción del perfil del usuario
 */
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  animations: [
    trigger('shrinkOut', [
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
    ]),
    trigger('scaleEfect', [
      state('in', style({ transform: 'scale(1)' })),
      transition('void => *', [
        style({
          transform: 'scale(0)'
        }),
        animate('0.6s ease-in')
      ]),
      transition('* => void', [
        animate('0.6s ease-out', style({
          transform: 'scale(1)'
        }))
      ])
    ])
  ]
})

/**
 * Componente
 */
export class EditProfileComponent implements OnInit {

  // Variable para la validación de los datos
  myform: FormGroup;
  // Información del usuario
  public user: User;
  // boolean para saber si se va a editar la información
  public editUser = false;

  /**
   * Creates an instance of EditProfileComponent.
   * @param {FormBuilder} fb
   * @param {UserService} userService
   * @param {ComponentsService} componentService
   * @memberof EditProfileComponent
   */
  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    public componentService: ComponentsService
  ) {
  }

  /**
   * @memberof EditProfileComponent
   */
  ngOnInit() {
    this.user = this.userService.getUser();
    this.createForm();
  }

  /**
   * Método para setear el formulario
   * @memberof EditProfileComponent
   */
  createForm() {
    this.myform = this.fb.group({
      'name_user': [this.user.nickname, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
      'name': [this.user.name, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(30)])],
      'email': [this.user.email, Validators.compose([Validators.required])],
    });
  }

  /**
   * Método para editar la información del usuario
   * @memberof EditProfileComponent
   */
  editProfileUser() {
    this.editUser = !this.editUser;
  }

  /**
   * Método para editar la información del usuario
   * @param {any} data
   * @memberof EditProfileComponent
   */
  editProfile(data) {
    log.info(data);
    this.editUser = !this.editUser;
  }

}
