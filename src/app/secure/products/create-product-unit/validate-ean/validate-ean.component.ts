import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EanServicesService } from '../validate-ean/ean-services.service';

@Component({
  selector: 'app-validate-ean',
  templateUrl: './validate-ean.component.html',
  styleUrls: ['./validate-ean.component.scss']
})
export class ValidateEanComponent implements OnInit {
  options: FormGroup;
  eanGroup: FormGroup;
  public infox;
  // constructor() { }

  constructor(private fb: FormBuilder, private service: EanServicesService) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this.eanGroup = this.fb.group({
      eanCtrl: ['', Validators.required]
    });
  }

  getEanServices() {
    this.infox = this.service.validateEan().subscribe(res => {
      console.log('this.infox', this.infox);
    }, error => {console.log('Servicio no funciona')});
  }
}
