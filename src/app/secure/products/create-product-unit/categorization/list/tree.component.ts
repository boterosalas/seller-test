import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  template: `
  <ul class="tree-categories">
    <li *ngFor="let node of treeData">
      <div class="tree-item-categories" fxLayout="row" fxLayoutAlign="start center">
        <i class="material-icons" (click)="openSonClick(node)" *ngIf="!node.Show">
          add
        </i>
        <i class="material-icons" (click)="openSonClick(node)" *ngIf="node.Show">
          remove
        </i>
        <span class="tree-item" [innerHTML]="getName(node)">hola</span>
      </div>
      <app-tree [treeData]="node.Son" [open]="openSon" *ngIf="node.Show"></app-tree>
    </li>
  </ul>
  `,
  styleUrls: ['../search.component.scss']
})
export class TreeComponent  implements OnInit {
  @Input() treeData: any;
  @Input() open: boolean;
  openSon: boolean;
  constructor() {
  }

  ngOnInit() {
  }

  public openSonClick(node: any) {
    node.Show = !node.Show;
  }

  public getName(node: any): string {
    let htmlName = node.Name;
    if (node.ModifyName) {
      htmlName = node.ModifyName;
    }
    return htmlName;
  }
}
