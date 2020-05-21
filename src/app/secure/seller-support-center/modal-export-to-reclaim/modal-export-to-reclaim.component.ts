import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-export-to-reclaim',
  templateUrl: './modal-export-to-reclaim.component.html',
  styleUrls: ['./modal-export-to-reclaim.component.scss']
})
export class ModalExportToReclaimComponent implements OnInit {

  public form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {

    this.form = new FormGroup({
        nameBrands: new FormControl(''),
        importAll: new FormControl(''),
    });
}

}
