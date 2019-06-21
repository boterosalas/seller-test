import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-preview-list-card",
  templateUrl: "./preview-list-card.component.html",
  styleUrls: ["./preview-list-card.component.scss"]
})
export class PreviewListCardComponent implements OnInit {
  @Input() title: string;

  @Input() products: Array<any>;

  @Input() configuration: Array<Configuration>;

  @Output() onClickShowAll = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}

export interface Configuration {
  name: string;
  splitSymbol?: string;
}
