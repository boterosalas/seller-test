import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-search-historical-devolution-form',
  templateUrl: './search-historical-devolution-form.component.html',
  styleUrls: ['./search-historical-devolution-form.component.scss']
})
export class SearchHistoricalDevolutionFormComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {

  }

}
