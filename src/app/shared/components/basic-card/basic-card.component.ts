import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-basic-card",
  template: `
    <div class="basic-card">
      <span class="basic-card__title basic-card__title--bottom-space">
        {{ title }}
      </span>
      <p class="basic-card__description">{{ description }}</p>
    </div>
  `,
  styleUrls: ["./basic-card.component.scss"]
})
export class BasicCardComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;

  constructor() {}

  ngOnInit() {}
}
