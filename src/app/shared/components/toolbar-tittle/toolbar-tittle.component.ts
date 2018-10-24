import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-tittle',
  templateUrl: './toolbar-tittle.component.html',
  styleUrls: ['./toolbar-tittle.component.scss']
})
export class ToolbarTittleComponent implements OnInit {

  @Input() tittleBar: string;
  @Input() subtitleBar: string;

  constructor() { }

  ngOnInit(): void { }
}
