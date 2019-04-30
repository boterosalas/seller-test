import { Component, OnInit, Input } from '@angular/core';
import { CategoryTreeService } from './category-tree.service';
import { LoadingService } from '@app/core';
import { AnyKindOfDictionary } from 'lodash';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent implements OnInit {

  @Input() categoryList = [];
  @Input() isNode = true;
  @Input() margin = 0;
  totalMargin = '0px';


  constructor(private categoryService: CategoryTreeService,
    private loadingService: LoadingService) {
  }

  ngOnInit() {
    if(this.categoryList.length === 0) {
      this.getTree();
    }
    this.margin++;
    this.totalMargin = `${this.margin * 20}px`;
  }

  getTree() {
    this.loadingService.viewSpinner();
    this.categoryService.getCategoryTree().subscribe((response: any) => {
      const data = JSON.parse(response.body.body).Data;
      this.categoryList = this.orderData(data);
      console.log(this.categoryList);
      this.loadingService.closeSpinner();
    });
  }

  orderData(dataList: any[]) {
    dataList.map(element => {
      if (!element.Son) {
        element.Son = [];
        element.Show = false;
      }
      return element;
    });
    return this.orderCategoryList(dataList);
  }

  orderCategoryList(list: any[]) {
    return list.reduce((previous, current) => {
      list.forEach((element) => {
        if (!!element.IdParent && current.Id === element.IdParent) {
          current.Son.push(element);
        }
      });
      if(!current.IdParent) {
       previous.push(current);
      }
      return previous;
    }, []);
  }

  showChildrens(category) {
    console.log(category.Name, 'show');
    category.Show = !category.Show;
  }

  Editar(category) {
    console.log(category, 'vamos a editar');
  }
}
