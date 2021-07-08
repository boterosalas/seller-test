import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-program-ofert',
  templateUrl: './modal-program-ofert.component.html',
  styleUrls: ['./modal-program-ofert.component.scss']
})
export class ModalProgramOfertComponent implements OnInit {

  public form: FormGroup;
  public priceCurrent = '';
  public discountPriceCurrent = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.createForm();
    this.priceCurrent = this.data !== null ? this.data.price.value : null;
    this.discountPriceCurrent = this.data !== null ? this.data.discountPrice.value : null;
  }

  createForm() {
    this.form = new FormGroup({
      price: new FormControl(''),
      DiscountPrice: new FormControl(''),
      startDate: new FormControl(''),
      dateEnd: new FormControl(''),
    });

  }


}
