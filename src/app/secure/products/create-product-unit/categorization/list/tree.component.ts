import { Component, Input, OnInit } from '@angular/core';
import { SearchService } from '../search.component.service';

@Component({
  selector: 'app-tree',
  template: `
  <div class="tree-categories">
    <div *ngFor="let node of treeData" [ngClass]="{'tree-item-selected' : !node.Son.length}">
      <div class="tree-item-categories" fxLayout="row" fxLayoutAlign="start center" (click)="selectCategory(node) && !node.Son.length">
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

  /**
   * Init variables
   *
   * @type {*}
   * @memberof TreeComponent
   */
  @Input() treeData: any;
  @Input() open: boolean;
  @Input() margin: number;
  openSon: boolean;

  /** Constructor empty */
  constructor(private searchService: SearchService) {
  }

  /** Initialize component gets margin in number to show  */
  ngOnInit() {
    if ( !this.margin ) {
      this.margin = 1;
    }
    this.margin ++;
  }

  /**
   * Expand or Collapse all items.
   *
   * @param {*} node
   * @memberof TreeComponent
   */
  public openSonClick(node: any) {
    node.Show = !node.Show;
  }

  /**
   * Select category and send to service.
   *
   * @param {*} node
   * @memberof TreeComponent
   */
  public selectCategory(node: any): void {
    if (!node.Son.length) {
       this.searchService.setCategory(node);
    }
  }

  /**
   * Gets margin with em.
   *
   * @param {*} node
   * @returns {string}
   * @memberof TreeComponent
   */
  public getMargin(node: any): string {
    if (node && !node.Son.length) {
      return (3 + this.margin) + 'em';
    } else if (node) {
      return '0';
    } else {
      return this.margin + 'em';
    }
  }

  /**
   * Get name or modify name who gets when match with search text.
   *
   * @param {*} node
   * @returns {string}
   * @memberof TreeComponent
   */
  public getName(node: any): string {
    let htmlName = node.Name;
    if (node.ModifyName) {
      htmlName = node.ModifyName;
    }
    return htmlName;
  }
}
