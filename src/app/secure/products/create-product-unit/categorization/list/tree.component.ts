import { Component, Input, OnInit } from '@angular/core';
import { String } from 'aws-sdk/clients/kinesisvideoarchivedmedia';

@Component({
  selector: 'app-tree',
  template: `
  <div class="tree-categories">
    <div *ngFor="let node of treeData" [ngClass]="{'tree-item-selected' : !node.Son.length}">
      <div class="tree-item-categories" fxLayout="row" fxLayoutAlign="start center">
        <i [ngStyle]="{'margin-left':getMargin()}" class="material-icons" (click)="openSonClick(node)" *ngIf="!node.Show && node.Son.length">
          add
        </i>
        <i [ngStyle]="{'margin-left':getMargin()}" class="material-icons" (click)="openSonClick(node)" *ngIf="node.Show && node.Son.length">
          remove
        </i>
        <span class="tree-item" [innerHTML]="getName(node)" [ngClass]="{'tree-item-father' : !node.IdParent}"  [ngStyle]="{'margin-left':getMargin(node)}"></span>
      </div>
      <app-tree [treeData]="node.Son" [open]="openSon" [margin]="margin" *ngIf="node.Show"></app-tree>
    </div>
  </div>
  `,
  styleUrls: ['../search.component.scss']
})
export class TreeComponent  implements OnInit {
  @Input() treeData: any;
  @Input() open: boolean;
  @Input() margin: number;
  openSon: boolean;
  constructor() {
  }

  ngOnInit() {
    if ( !this.margin ) {
      this.margin = 1;
    }
    this.margin ++;
    console.log(this.margin);
  }

  public openSonClick(node: any) {
    node.Show = !node.Show;
  }

  public getMargin(node: any): string {
    if (node && !node.Son.length) {
      return (3 + this.margin) + 'em';
    } else if (node) {
      return '0';
    } else {
      return this.margin + 'em';
    }
  }

  public getName(node: any): string {
    let htmlName = node.Name;
    if (node.ModifyName) {
      htmlName = node.ModifyName;
    }
    return htmlName;
  }
}
