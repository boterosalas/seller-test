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

  /**
   * param that represent the category list to render
   */
  @Input() categoryList = [];
  /**
   * param that represent the lvl tree
   */
  @Input() margin = 0;
  /**
   * param that represent the update access
   */
  @Input() canUpdate = false;
  /**
   * param that represent the create access
   */
  @Input() canCreate = false;
  /**
   * param that represent the parent Component to make the logic for update and create
   */
  @Input('categoryComponent') parametrizationCategoryComponent: CategoriesComponent = null;
  /**
   * param that represent the margin to add to category list for each lvl
   */
  totalMargin = '0px';


  constructor() {
  }

  ngOnInit() {
    this.margin++;
    this.totalMargin = `${this.margin * 24}px`;
  }

  /**
   * Show the children for category
   * @param category represent the specific category to show children
   */
  showChildrens(category: any) {
    category.Show = !category.Show;
  }

  /**
   * Method that open the edit modal
   * @param category represen the specific category to get the data for edit modal
   */
  editCategory(category: any) {
    this.parametrizationCategoryComponent.openCategoryDialog(category, true);
  }

  /**
   * Method that open the create modal
   * @param category represen the specific category to get the data for create modal
   */
  createCategory(category: any) {
    this.parametrizationCategoryComponent.openCategoryDialog(category);
  }
}