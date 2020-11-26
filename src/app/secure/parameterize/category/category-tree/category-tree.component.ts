import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { LoadingService } from '@app/core';
import { CategoriesComponent } from '../categories/categories.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { ListProductService } from '@app/secure/products/list-products/list-products.service';

export interface TreeSelected {
  selectElement: (element) => void;
}

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
  // tslint:disable-next-line: no-input-rename
  @Input('categoryComponent') parametrizationCategoryComponent: CategoriesComponent | TreeSelected = null;
  /**
   * param that represent the margin to add to category list for each lvl
   */
  totalMargin = '0px';

  isDisabled = false;

  constructor(
    private languageService: TranslateService,
    private snackBar: MatSnackBar,
    private productsService?: ListProductService,
    private loadingService?: LoadingService,
  ) {
  }

  ngOnInit() {
    this.margin++;
    this.totalMargin = `${this.margin * 24}px`;
    this.changeLanguage();
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
    const currentLang = localStorage.getItem('culture_current');
    if ((<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog !== undefined) {
      if (currentLang !== 'US') {
        (<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog(category, true);
      } else {
        this.snackBar.open(this.languageService.instant('secure.parametize.category.categories.change_language_english_edit'), this.languageService.instant('actions.close'), {
          duration: 3000
        });
      }
    }
  }

  /**
   * Función para eliminar categoría
   * @param {*} category
   * @memberof CategoryTreeComponent
   */
  deleteCategory(category: any) {
    this.loadingService.viewSpinner();
    const currentLang = localStorage.getItem('culture_current');
    const idCategory = `?&limit=1&page=0&categories=${category.Id}`;
    this.productsService.getListProducts(idCategory).subscribe((res: any) => {
      if (res && res.data.total > 0) {
        this.snackBar.open(this.languageService.instant('secure.parametize.category.categories.modal_delete_category_have_products'), this.languageService.instant('actions.close'), {
          duration: 4000
        });
        this.loadingService.closeSpinner();
      } else {
        this.loadingService.closeSpinner();
        if ((<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog !== undefined) {
          if (currentLang !== 'US') {
            (<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog(category, false, true);
          } else {
            this.snackBar.open(this.languageService.instant('secure.parametize.category.categories.change_language_english_edit'), this.languageService.instant('actions.close'), {
              duration: 3000
            });
          }
        }
      }
    });
    // if ((<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog !== undefined) {
    //   if (currentLang !== 'US') {
    //     (<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog(category, false, true);
    //   } else {
    //     // this.snackBar.open(this.languageService.instant('secure.parametize.category.categories.change_language_english_edit'), this.languageService.instant('actions.close'), {
    //     //   duration: 3000
    //     // });
    //   }
    // }
  }

  /**
   * Method that open the create modal
   * @param category represen the specific category to get the data for create modal
   */
  createCategory(category: any) {
    const currentLang = localStorage.getItem('culture_current');
    if ((<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog !== undefined) {
      if (currentLang !== 'US') {
      (<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog(category);
      } else {
        this.snackBar.open(this.languageService.instant('secure.parametize.category.categories.change_language_english_add'), this.languageService.instant('actions.close'), {
          duration: 3000
        });
      }
    }
  }

  eventName(category: any) {
    if ((<TreeSelected>this.parametrizationCategoryComponent).selectElement !== undefined) {
      (<TreeSelected>this.parametrizationCategoryComponent).selectElement(category);
    } else if ((<CategoriesComponent>this.parametrizationCategoryComponent).openCategoryDialog !== undefined) {
      this.showChildrens(category);
    }
  }

  /**
   * funcion para escuchar el evento al cambiar de idioma
   *
   * @memberof CategoryTreeComponent
   */
  changeLanguage() {
    this.validateCulture(localStorage.getItem('culture_current'));
    this.languageService.onLangChange.subscribe((e: Event) => {
      const lang = e['lang'];
      this.validateCulture(lang);
    });
  }

  validateCulture(culture: string) {
    if (culture === 'US') {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }
}
