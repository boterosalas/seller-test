import { Component, OnInit, Inject, EventEmitter, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { countries } from '../../../../secure/seller/register/countries';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { PortCollectionService } from '../port-collection.service';

@Component({
  selector: 'app-modal-port',
  templateUrl: './modal-port.component.html',
  styleUrls: ['./modal-port.component.scss']
})
export class ModalPortComponent implements OnInit {

  public formPort: FormGroup;
  content: TemplateRef<any>;
  keywords = [];
  countries = countries;
  filterCountry = [];
  validateKey = true;
  countryCurrent: string;
  body: any;
  idPort: any;
  refresh= false;

  constructor(
    private snackBar: MatSnackBar,
    private languageService: TranslateService,
    private portCollectionService: PortCollectionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {}


}
