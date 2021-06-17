import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';
import { Subject } from 'rxjs';
import { MyProfileService } from '../myprofile.service';
import { LoadingService } from '@app/core';

@Component({
  selector: 'app-modal-contact-perfil',
  templateUrl: './modal-contact-perfil.component.html',
  styleUrls: ['./modal-contact-perfil.component.scss']
})
export class ModalContactPerfilComponent implements OnInit {

  public form: FormGroup;
  ContactRegex = { integerNumber: '', email : '' };
  public processFinishModalContactProfiel$ = new Subject<any>();
  public success = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: MyProfileService,
    public SUPPORT: SupportService,
    public dialogRef: MatDialogRef<ModalContactPerfilComponent>,
    private loadingService: LoadingService,
  ) {
  }

  ngOnInit() {
    this.getRegexByModule();
   }
/**
 * funcion para validar los caracteres por medio de la regex
 *
 * @memberof ModalContactPerfilComponent
 */
public getRegexByModule(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataOffertRegex = JSON.parse(res.body.body);
      dataOffertRegex = dataOffertRegex.Data.filter(data => data.Module === 'vendedores');
      for (const val in this.ContactRegex) {
        if (!!val) {
          const element = dataOffertRegex.find(regex => regex.Identifier === val.toString());
          this.ContactRegex[val] = element && `${element.Value}`;
        }
      }
      this.createForm();
    });
  }
  /**
   * funcion para crear el formulario de contactos
   *
   * @memberof ModalContactPerfilComponent
   */
  createForm() {
    this.form = new FormGroup({
      translate: new FormControl(''),
      contactName: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.ContactRegex.email)])),
      cellPhone: new FormControl('', Validators.compose([Validators.required, Validators.pattern(this.ContactRegex.integerNumber)])),
      phone: new FormControl('')
    });
    if (this.form) {
      this.form.controls.translate.setValue(this.data.contact.Traduction);
      this.form.controls.contactName.setValue(this.data.contact.ContactName);
      this.form.controls.role.setValue(this.data.contact.Role);
      this.form.controls.email.setValue(this.data.contact.Email);
      this.form.controls.cellPhone.setValue(this.data.contact.Cellphone);
      this.form.controls.phone.setValue(this.data.contact.Phone);
    }
  }
  /**
   * funcion para validar el contacto
   *
   * @memberof ModalContactPerfilComponent
   */
  validContact() {
    this.loadingService.viewSpinner();
    if (
      this.data.contact.Traduction !== null &&
      this.data.contact.ContactName !== null &&
      this.data.contact.Role !== null &&
      this.data.contact.Email !== null) {
      this.editContact();
    } else {
      this.createContactData();
    }
  }
  /**
   * funcion para setear variables
   *
   * @returns
   * @memberof ModalContactPerfilComponent
   */
  setParamas() {
    const contactName = this.form.controls.contactName ? this.form.controls.contactName.value : null;
    const params = {
      IdSeller: this.data.idSeller ? this.data.idSeller : null,
      Cellphone: this.form.controls.cellPhone ? parseInt(this.form.controls.cellPhone.value, 0) : null,
      ContactName: contactName ? contactName.replace(/\b\w/g, l => l.toUpperCase()) : null,
      Email: this.form.controls.email.value,
      NameList: this.valiteResponsable(this.form.controls.translate.value),
      Phone: this.form.controls.phone.value ? this.form.controls.phone.value : null,
      Role: this.form.controls.role.value,
    };
    return params;
  }
  /**
   * funcion para crear contancto
   *
   * @memberof ModalContactPerfilComponent
   */
  createContactData() {
    const params = this.setParamas();
    this.profileService.createContactData(params).subscribe(result => {
      if (result.Data) {
        this.success = true;
        this.processFinishModalContactProfiel$.next();
        this.loadingService.closeSpinner();
      } else {
        this.success = false;
        this.loadingService.closeSpinner();
      }
    });
  }
  /**
   * funcion para editar el contacto
   *
   * @memberof ModalContactPerfilComponent
   */
  editContact() {
    const params = this.setParamas();
    this.profileService.updateContactData(params).subscribe(result => {
      if (result.Data) {
        this.processFinishModalContactProfiel$.next();
        this.success = true;
        this.loadingService.closeSpinner();
      } else {
        this.success = false;
        this.loadingService.closeSpinner();
      }
    });
  }
  /**
   * funcion para validar el nombre a mostrar en el select de area responsable
   *
   * @param {*} areaResponsable
   * @returns
   * @memberof ModalContactPerfilComponent
   */
  valiteResponsable(areaResponsable: any) {
    const nameList = this.data.arrayListArea.find(x => x.Traduction === areaResponsable).NameList;
    return nameList;
  }
  /**
   * funcion para cerrar el modal
   *
   * @memberof ModalContactPerfilComponent
   */
  close() {
    this.dialogRef.close();
  }
  /**
   * funcion para validar los campos de telefono celular y telefono
   *
   * @memberof ModalContactPerfilComponent
   */
  validateOutFocus_CellPhone() {
    if (this.form) {
      const cellPhone = this.form.controls.cellPhone.value;
      if (cellPhone) {
        this.form.controls.phone.clearValidators();
        this.form.controls.cellPhone.updateValueAndValidity();
      } else {
        this.form.controls.phone.clearValidators();
        this.form.controls.phone.setValidators(Validators.compose([Validators.required]));
        this.form.controls.cellPhone.updateValueAndValidity();
      }
    }
  }
  /**
   * funcion para validar el numero de telefono no celular
   *
   * @memberof ModalContactPerfilComponent
   */
  validateOutFocus_Phone() {
    if (this.form) {
      const phone = this.form.controls.phone.value;
      if (phone) {
        this.form.controls.cellPhone.clearValidators();
        this.form.controls.cellPhone.setValidators(Validators.compose([Validators.pattern(this.ContactRegex.integerNumber)]));
        this.form.controls.cellPhone.updateValueAndValidity();
      } else {
        this.form.controls.cellPhone.clearValidators();
        this.form.controls.cellPhone.setValidators(Validators.compose([Validators.required, Validators.pattern(this.ContactRegex.integerNumber)]));
        this.form.controls.cellPhone.updateValueAndValidity();
      }
    }
  }
}
