import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-result-load-exception',
  templateUrl: './modal-result-load-exception.component.html',
  styleUrls: ['./modal-result-load-exception.component.scss']
})
export class ModalResultLoadExceptionComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
  }

}
