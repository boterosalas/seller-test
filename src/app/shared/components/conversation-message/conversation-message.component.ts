import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Configuration } from './configuration.model';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss']
})
export class ConversationMessageComponent {
  _THEMES = {
    BASIC: 'BASIC',
    ALTER: 'ALTER'
  };

  @Input() name: string;

  @Input() message: string;

  @Input() date: string;

  @Input() configuration: Configuration = {
    theme: this._THEMES.BASIC,
    reply: false
  };

  @Output() replyEvent = new EventEmitter();
}
