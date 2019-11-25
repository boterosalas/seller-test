import { Input, Component } from '@angular/core';

@Component({
  selector: 'app-notification-circle',
  template: `
    <div *ngIf="value && value > 0" class="notification-circle">
      <span id="notification-value">{{ value }}</span>
    </div>
  `,
  styleUrls: ['./notification-circle.component.scss']
})
export class NotificationCircleComponent {
  @Input() value: number;

  constructor() {}
}
