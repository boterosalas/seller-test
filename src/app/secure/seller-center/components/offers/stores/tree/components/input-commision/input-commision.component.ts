import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-commision',
  templateUrl: './input-commision.component.html',
  styleUrls: ['./input-commision.component.scss']
})
export class InputCommisionComponent implements OnInit {

  input_value = 15;

  constructor() { }

  ngOnInit() {
  }

}
