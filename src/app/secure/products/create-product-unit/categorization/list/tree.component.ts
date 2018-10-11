import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  template: `
  <ul>
    <li *ngFor="let node of treeData">
      {{node.Name}}
      <i class="material-icons" (click)="openSonClick(node)" *ngIf="!node.Show">
        keyboard_arrow_down
      </i>
      <i class="material-icons" (click)="openSonClick(node)" *ngIf="node.Show">
        keyboard_arrow_up
      </i>
      <app-tree [treeData]="node.Son" [open]="openSon" *ngIf="node.Show"></app-tree>
    </li>
  </ul>
  `
})
export class TreeComponent  implements OnInit {
  @Input() treeData: any;
  @Input() open: boolean;
  openSon: boolean;
  constructor() {
    console.log(this.treeData);
  }

  ngOnInit() {
    console.log(this.treeData);
  }

  public openSonClick(node: any) {
    node.Show = !node.Show;
  }
}
