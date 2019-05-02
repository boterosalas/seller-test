import { Component, OnInit, Input } from '@angular/core';
import { LoadingService } from '@app/core';
import { AnyKindOfDictionary } from 'lodash';
import { CategoryTreeService } from '../category-tree.service';
import { CategoriesComponent } from '../categories/categories.component';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent implements OnInit {

  @Input() categoryList = [];
  @Input() margin = 0;
  @Input() canUpdate = false;
  @Input() canCreate = false;
  @Input('categoryComponent') parametrizationCategoryComponent: CategoriesComponent;
  totalMargin = '0px';


  constructor(private categoryService: CategoryTreeService,
    private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.margin++;
    this.totalMargin = `${this.margin * 20}px`;
  }

  showChildrens(category: any) {
    category.Show = !category.Show;
  }

  editCategory(category: any) {
    this.parametrizationCategoryComponent.openCategoryDialog(category, true);
  }

  createCategory(category: any) {
    this.parametrizationCategoryComponent.openCategoryDialog(category);
  }
}
