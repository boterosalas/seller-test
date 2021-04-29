import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent implements OnInit {

  @Output() isBackList = new EventEmitter<object>();

  constructor(
    public translateService: TranslateService,
  ) { }

  ngOnInit() {
    this.configEditText();
  }

  configEditText(){
    
  }

  backList() {
    this.isBackList.emit({back : true});
  }

}
