import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { SupportService } from '@app/secure/support-modal/support.service';
import { MyProfileService } from '../myprofile.service';

@Component({
  selector: 'app-modal-contact-perfil',
  templateUrl: './modal-contact-perfil.component.html',
  styleUrls: ['./modal-contact-perfil.component.scss']
})
export class ModalContactPerfilComponent implements OnInit {

  public form: FormGroup;
  ContactRegex = { integerNumber: '' };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: MyProfileService,
    public SUPPORT: SupportService,
  ) {
    this.getRegexByModule();
  }

  ngOnInit() { }

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

  createForm() {
    console.log(this.ContactRegex);
    this.form = new FormGroup({
      translate: new FormControl(''),
      contactName: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      cellPhone: new FormControl('', Validators.compose([Validators.pattern(this.ContactRegex.integerNumber)])),
      phone: new FormControl('', Validators.compose([Validators.pattern(this.ContactRegex.integerNumber)]))
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

  validContact() {
    if (
      this.data.contact.Traduction !== null &&
      this.data.contact.ContactName !== null &&
      this.data.contact.Role !== null &&
      this.data.contact.Email !== null &&
      this.data.contact.Cellphone &&
      this.data.contact.Phone !== null) {
      this.editContact();
    } else {
      this.createContactData();
    }

  }

  createContactData() {
  const contactName = this.form.controls.contactName ? this.form.controls.contactName.value : null;
    const params = {
      IdSeller: this.data.idSeller ? this.data.idSeller : null,
      Cellphone: this.form.controls.cellPhone ? parseInt(this.form.controls.cellPhone.value, 0) : null,
      ContactName: contactName ? contactName.replace(/\b\w/g, l => l.toUpperCase()) : null,
      Email: this.form.controls.email.value,
      NameList: this.valiteResponsable(this.form.controls.translate.value),
      Phone: this.form.controls.phone.value ? parseInt(this.form.controls.phone.value, 0) : null,
      Role: this.form.controls.role.value,
    };
    this.profileService.createContactData(params).subscribe(result => {
      console.log(result);
    });
  }

  editContact() {
    const contactName = this.form.controls.contactName ? this.form.controls.contactName.value : null;
    const params = {
      IdSeller: this.data.idSeller ? this.data.idSeller : null,
      Cellphone: this.form.controls.cellPhone ? parseInt(this.form.controls.cellPhone.value, 0) : null,
      ContactName: contactName ? contactName.replace(/\b\w/g, l => l.toUpperCase()) : null,
      Email: this.form.controls.email.value,
      NameList: this.valiteResponsable(this.form.controls.translate.value),
      Phone: this.form.controls.phone.value ? parseInt(this.form.controls.phone.value, 0) : null,
      Role: this.form.controls.role.value,
    };
    console.log(params);
    this.profileService.updateContactData(params).subscribe(result => {
      console.log(result);
    });
  }

  valiteResponsable(areaResponsable: any) {
    const nameList = this.data.arrayListArea.find(x => x.Traduction === areaResponsable).NameList;
    return nameList;
  }

  validateCellOrPhone(event: any) {
    console.log(event);
  }
}
