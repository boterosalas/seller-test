import { AbstractControl, FormGroup } from '@angular/forms';

/**
 * Utilidades desacopladas que se pueden utilizar estáticamente.
 *
 * @export
 * @class Static
 */
export class Static {
  /**
   * Setea un conjunto de propiedades de un objeto
   * utilizando los datos de otro.
   * Útil cuando se quiere setear propiedades de una clase
   * de forma perezosa con datos parciales de otro objeto.
   *
   * @param {*} target - objeto que se va a setear.
   * @param {*} values - valores utilizados para setear.
   * @memberof Static
   */
  static setAll(target: {}, values: {}) {
    for (const key in values) {
      if (values.hasOwnProperty(key)) {
        target[key] = values[key];
      }
    }
  }

  /**
   * Elimina las propiedades extra de un objeto.
   * Se toma como base las propiedades del primer
   * objeto(source), las propiedades que este posea
   * son las que perduran en el segundo(target).
   *
   * @param {Object} source
   * @param {Object} target
   * @memberof Static
   */
  static hardCast(source: Object | string[], target: Object): any {
    const _target = Object.assign({}, target);
    const validKeys = typeof source === 'object' ? Object.keys(source) : source;
    for (const key in target) {
      if (target.hasOwnProperty(key)) {
        if (!validKeys.includes(key)) {
          delete _target[key];
        }
      }
    }
    return _target;
  }

  /**
   * Determina si un elemento nativo del DOM posee
   * una clase en especifico.
   *
   * @static
   * @param {*} el
   * @param {string} name
   * @returns
   * @memberof Static
   */
  static nativeElementHasClass(el: any, name: string) {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  /**
   * Agrega una clase a un elemento nativo del DOM.
   *
   * @static
   * @param {*} el
   * @param {string} name
   * @memberof Static
   */
  static nativeElemenAddClass(el: any, name: string) {
    if (!this.nativeElementHasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  /**
   * Elimina una clase a un elemento nativo del DOM.
   *
   * @static
   * @param {*} el
   * @param {string} name
   * @memberof Static
   */
  static nativeElemenRemoveClass(el: any, name: string) {
    if (this.nativeElementHasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  /**
   * Retorna el nombre de un control dentro de un formulario reactivo.
   *
   * @static
   * @param {AbstractControl} control
   * @returns {string}
   * @memberof Static
   */
  static getControlName(control: AbstractControl): string {
    const parent = control['_parent'];
    let controlName = null;
    // FormGroup, tiene un diccionario con los nombres de los controles
    if (parent instanceof FormGroup) {
      Object.keys(parent.controls).forEach(name => {
        if (control === parent.controls[name]) {
          controlName = name;
        }
      });
    }
    return controlName;
  }
} // End class
