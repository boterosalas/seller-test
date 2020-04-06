import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-down-list-header',
  templateUrl: './drop-down-list-header.component.html',
  styleUrls: ['./drop-down-list-header.component.scss']
})
export class DropDownListHeaderComponent {
  @Input() configurations: Array<Configuration>;
}

export interface Configuration {
  name: string;
  displayName: String;
  xs?: number; // No implemented
  sm?: number; // No implemented
  md?: number;
  lg?: number; // No implemented
  xl?: number; // No implemented
}
