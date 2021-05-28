import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MyProfileService } from '../myprofile.service';

@Component({
  selector: 'app-modal-contact-perfil',
  templateUrl: './modal-contact-perfil.component.html',
  styleUrls: ['./modal-contact-perfil.component.scss']
})
export class ModalContactPerfilComponent implements OnInit {

  public form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: MyProfileService,
  ) {
    this.createForm();
   }

  ngOnInit() {
    if(this.form){
      this.form.controls.translate.setValue(this.data.contact.Traduction);
      this.form.controls.contactName.setValue(this.data.contact.ContactName);
      this.form.controls.role.setValue(this.data.contact.Role);
      this.form.controls.email.setValue(this.data.contact.Email);
      this.form.controls.cellPhone.setValue(this.data.contact.Cellphone);
      this.form.controls.phone.setValue(this.data.contact.Phone);
    }
  }

  createForm() {
    this.form = new FormGroup({
      translate: new FormControl(''),
      contactName: new FormControl(''),
      role: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      cellPhone: new FormControl(''),
      phone: new FormControl('')
    });
  }

  editContact(){
    const params = {
      Cellphone: null,
      ContactName: null,
      Email: null,
      NameList: "Gerente General",
      Phone: null,
      Role: null,
      SellerName: null,
      Traduction: "Gerente General"
    }
    this.profileService.updateContactData(params).subscribe(result =>{

    })
    console.log(this.form);
  }

}
