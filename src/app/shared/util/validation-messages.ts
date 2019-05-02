import { Validator, AbstractControl, ValidationErrors } from "@angular/forms";

export const validationMessages = {
  required: 'Este campo es necesario.',
  minLength: 'El campo es muy corto.',
  maxLength: 'El campo es muy largo.',
  email: 'Email invalido.',
  number: 'Este campo debe ser numérico.'
};

export function trimField(control: AbstractControl): ValidationErrors | null {
  const value = !!control.value ? control.value : '';
  return !!value.toString().trim() ? null : {trim: true}
}