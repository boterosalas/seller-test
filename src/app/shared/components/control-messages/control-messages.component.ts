import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Static } from '@shared/util/static';
import { validationMessages } from '@shared/util/validation-messages';


@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
  styleUrls: ['./control-messages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ControlMessagesComponent implements OnInit {
  // Referencia del formulario
  @Input() control: FormControl;
  // Mensajes de validación personalizados
  @Input() messages: { [key: string]: string } = {};
  // Nombre del control
  keyControl: string;
  // Errores de validación
  errors: any[] = [];
  // Mensajes de validación por defecto
  validationMessagesDefault = validationMessages;

  constructor() {
  }

  ngOnInit() {
    this.keyControl = Static.getControlName(this.control);
    this.control.valueChanges.subscribe(change => {
      this.validateControl();
    });
    this.mergeValidationMessages();
    this.validateControl();
  }

  /**
   * Sobrescribe los mensajes de validación
   * definidos por default con los personalizados definidos en cada campo.
   *
   * @memberof ControlMessagesComponent
   */
  private mergeValidationMessages() {
    const mergeJSON = require('locutus/php/array/array_merge');
    this.messages = mergeJSON(this.validationMessagesDefault, this.messages);
  }

  /**
   * Recorre cada control del formulario y verifica que
   * las reglas de validación se cumplan.
   *
   * @memberof ControlMessagesComponent
   */
  validateControl(ignoreDirty: boolean = false) {
    this.errors = [];
    if (this.control && this.control.invalid) {
      if (ignoreDirty || this.control.dirty) {
        Object.keys(this.control.errors).forEach((key: string) => {
          this.errors.push(this.messages[key]);
        });
      }
    }
  }
} // End class
