import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-modal-load-agreement',
  templateUrl: './modal-load-agreement.component.html',
  styleUrls: ['./modal-load-agreement.component.scss']
})
export class ModalLoadAgreementComponent implements OnInit {

  public form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      typeAgreement: new FormControl(''),
    });
  }

}
