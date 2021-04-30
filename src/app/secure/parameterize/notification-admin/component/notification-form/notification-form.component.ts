import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor/lib/config';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit {

  @Output() isBackList = new EventEmitter<object>();
  public form: FormGroup;

  public config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '150px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    placeholder: 'por aca carga las configurarionnes',
    translate: 'no',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      [],
      [
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = new FormGroup({
      bodyNotification: new FormControl(''),
      dateInitial: new FormControl(''),
      title: new FormControl(''),
      lenguaje: new FormControl(''),
      dateEnd: new FormControl(''),
      pageDestiny: new FormControl(''),
      bodyDescription: new FormControl(''),
      pickerColor: new FormControl(''),
      fileImg: new FormControl(''),
    });
  }

  setValueColor(color: string) {
    this.form.controls.pickerColor.setValue(color);
  }

  createNotification(){
    console.log(this.form.controls);
  }

  backList() {
    this.isBackList.emit({ back: true });
  }

}
