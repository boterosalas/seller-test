import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-input-commision',
  templateUrl: './input-commision.component.html',
  styleUrls: ['./input-commision.component.scss']
})
export class InputCommisionComponent implements OnInit {

  @Input() inputValue;
  @Input() currenTree: any;
  @Input() updateFunction: boolean;
  public parameters: Array<{}> = [];
  public searchStore: any;
  public idSeller: any;
  public data: any;
  public node_tree_modify: any;

  constructor() {
  }

  ngOnInit() {
    // tslint:disable-next-line:radix
    this.searchStore = JSON.parse(localStorage.getItem('searchStore'));
    this.idSeller = this.searchStore.IdSeller.toString();
  }

  setNewCommission(data, event) {
    const commission = parseFloat(event.target.value);
    this.parameters = localStorage.getItem('parametersCommission') !== null ? JSON.parse(localStorage.getItem('parametersCommission')) : [];

    const nodeModify = this.getNodeModify(data.idCategory, commission, this.currenTree);
    this.modifyCommission(data.idCategory, commission, nodeModify);
    localStorage.setItem('parametersCommission', JSON.stringify(this.parameters));
  }

  getNodeModify(idCategory, commission, current_tree) {
    for (let i = 0; i < current_tree.length; i++) {
      if (idCategory === current_tree[i].idParent) {
        this.node_tree_modify = current_tree;
        break;
      } else {
        if (typeof current_tree[i].children !== 'undefined') {
          this.getNodeModify(idCategory, commission, current_tree[i].children);
        }
      }
    }
    return this.node_tree_modify;
  }

  modifyCommission(idCategory, commission, node) {
    if (node !== undefined && node !== null && node) {
      this.validateIdInParameters(idCategory, commission);
      for (let i = 0; i < node.length; i++) {
        if (idCategory === node[i].idParent) {
          if (node[i].children !== undefined && node[i].children !== null && node[i].children) {
            this.modifyCommission(node[i].idCategory, commission, node[i].children);
          } else {
            this.validateIdInParameters(node[i].idCategory, commission);
          }
        }
      }
    } else {
      this.validateIdInParameters(idCategory, commission);
    }
  }

  validateIdInParameters(idCategory, commission) {
    const input = document.getElementById('id-category-' + idCategory);
    let isRepeat = false;
    if (this.parameters.length <= 0) {
      this.parameters.push(
        { 'idCategory': idCategory, 'idSeller': this.idSeller, 'commission': commission }
      );
      this.changeValueInput(input, commission);
    } else {
      for (let i = 0; i < this.parameters.length; i++) {
        if (this.parameters[i]['idCategory'] === idCategory) {
          isRepeat = true;
          this.parameters[i]['commission'] = commission;
          this.changeValueInput(input, commission);
        }
      }
      if (!isRepeat) {
        this.parameters.push(
          { 'idCategory': idCategory, 'idSeller': this.idSeller, 'commission': commission }
        );
        this.changeValueInput(input, commission);
      }
    }
  }

  changeValueInput(input, commission) {
    if (input !== null && input !== undefined && input) {
      input['value'] = commission;
    }
  }
}
