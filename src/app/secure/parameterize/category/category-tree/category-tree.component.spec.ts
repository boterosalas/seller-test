import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { CategoryTreeComponent } from './category-tree.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CategoriesComponent } from '../categories/categories.component';
import { SharedModule } from '@app/shared/shared.module';
import { LoadingService } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ListProductService } from '@app/secure/products/list-products/list-products.service';

describe('CategoryTreeComponent', () => {
  let component: CategoryTreeComponent;
  let fixture: ComponentFixture<CategoryTreeComponent>;
  const mockCategoriesComponent: CategoriesComponent = jasmine.createSpyObj('CategoriesComponent', ['openCategoryDialog']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner', 'viewProgressBar', 'closeProgressBar']);
  const mockListProductService = jasmine.createSpyObj('ListProductService', ['getListProducts']);
  const mockCategoryListWithoutChild = [
    {
      Commission: 15,
      Id: 27176,
      IdCarulla: null,
      IdCatalogos: null,
      IdExito: 'catmp0000000000',
      IdMarketplace: 'catmp0000000000',
      IdParent: null,
      IdVTEX: null,
      IsExitoShipping: true,
      Name: 'Marketplace',
      ProductType: 'Technology',
      Promisedelivery: '2 a 5',
      Show: false,
      SkuShippingSize: '2',
      Son : []
    }
  ];

  const mockCategoryListWithChild = [
    {
      Commission: 15,
      Id: 27176,
      IdCarulla: null,
      IdCatalogos: null,
      IdExito: 'catmp0000000000',
      IdMarketplace: 'catmp0000000000',
      IdParent: null,
      IdVTEX: null,
      IsExitoShipping: true,
      Name: 'Marketplace',
      ProductType: 'Technology',
      Promisedelivery: '2 a 5',
      Show: false,
      SkuShippingSize: '2',
      Son : [
        {
          Commission: 15,
          Id: 27177,
          IdCarulla: null,
          IdCatalogos: null,
          IdExito: 'catmp1000000000',
          IdMarketplace: 'catmp1000000000',
          IdParent: 27176,
          IdVTEX: null,
          IsExitoShipping: true,
          Name: 'Nacionales',
          ProductType: 'Technology',
          Promisedelivery: '2 a 5',
          Show: false,
          SkuShippingSize: '2',
          Son: []
        }
      ]
    }
  ];

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTreeComponent ],
      imports: [SharedModule, HttpClientTestingModule],
      providers: [
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: ListProductService, useValue: mockListProductService},

      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTreeComponent);
    component = fixture.componentInstance;
    component.categoryList = mockCategoryListWithoutChild;
    component.margin = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    fixture.whenStable().then(() => {{
      expect(component).toBeTruthy();
    }});
  });

  describe('Category tree exist without child', () => {
    beforeEach(fakeAsync(() => {
      component.categoryList = mockCategoryListWithoutChild;
      component.margin = 0;
    }));
    describe('Full access', () => {
      beforeEach(fakeAsync(() => {
        component.canCreate = true;
        component.canUpdate = true;
        fixture.detectChanges();
      }));

      it('Should be exist edit button', () => {
        const btnEdit = fixture.debugElement.query(By.css('#btn-edit-category'));
        expect(btnEdit).toBeTruthy();
        const btnEditElement = btnEdit.nativeElement;
        expect(btnEditElement).toBeTruthy();
      });

      it('Should be exist create button', () => {
        const btnCreate = fixture.debugElement.query(By.css('#btn-add-category'));
        expect(btnCreate).toBeTruthy();
        const btnCreateElement = btnCreate.nativeElement;
        expect(btnCreateElement).toBeTruthy();
      });

      it('Should be not exist drop down button', () => {
        const btnDropDown = fixture.debugElement.query(By.css('#arrow-down-category'));
        expect(btnDropDown).toBeNull();
      });

      it('Should be not exist drop up button', () => {
        const btnDropUp = fixture.debugElement.query(By.css('#arrow-up-category'));
        expect(btnDropUp).toBeNull();
      });

    });
  });

  describe('Category tree exist with child', () => {
    beforeEach(fakeAsync(() => {
      component.categoryList = mockCategoryListWithChild;
      component.margin = 0;
    }));
    describe('Full access', () => {
      beforeEach(fakeAsync(() => {
        component.canCreate = true;
        component.canUpdate = true;
        component.categoryList[0].Show = false;
        component.parametrizationCategoryComponent = mockCategoriesComponent;
        (<any>mockCategoriesComponent.openCategoryDialog).calls.reset();
        fixture.detectChanges();
      }));

      it('Should be exist edit button', () => {
        const btnEdit = fixture.debugElement.query(By.css('#btn-edit-category'));
        expect(btnEdit).toBeTruthy();
        const btnEditElement = btnEdit.nativeElement;
        expect(btnEditElement).toBeTruthy();
      });

      it('Should be exist edit button', () => {
        const btnCreate = fixture.debugElement.query(By.css('#btn-add-category'));
        expect(btnCreate).toBeTruthy();
        const btnCreateElement = btnCreate.nativeElement;
        expect(btnCreateElement).toBeTruthy();
      });

      it('Should be exist drop down button', () => {
        const btnDropDown = fixture.debugElement.query(By.css('#arrow-down-category'));
        expect(btnDropDown).toBeTruthy();
        const btnDropDownElement = btnDropDown.nativeElement;
        expect(btnDropDownElement).toBeTruthy();
      });

      it('Should be not exist drop up button', () => {
        const btnDropUp = fixture.debugElement.query(By.css('#arrow-up-category'));
        expect(btnDropUp).toBeNull();
      });

      it('Should be exist drop up button', () => {
        component.categoryList[0].Show = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          const btnDropUp = fixture.debugElement.query(By.css('#arrow-up-category'));
          expect(btnDropUp).toBeTruthy();
          const btnDropUpElement = btnDropUp.nativeElement;
          expect(btnDropUpElement).toBeTruthy();
        });
      });

      it('Should be change the show attribute in category false to true', () => {
        let btnDropUp = fixture.debugElement.query(By.css('#arrow-up-category'));
        expect(btnDropUp).toBeNull();
        component.showChildrens(component.categoryList[0]);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          btnDropUp = fixture.debugElement.query(By.css('#arrow-up-category'));
          expect(btnDropUp).toBeTruthy();
          const btnDropUpElement = btnDropUp.nativeElement;
          expect(btnDropUpElement).toBeTruthy();
        });
      });

      it('Should be change the show attribute in category true to false', () => {
        component.categoryList[0].Show = true;
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          let btnDropUp = fixture.debugElement.query(By.css('#arrow-up-category'));
          expect(btnDropUp).toBeTruthy();
          const btnDropUpElement = btnDropUp.nativeElement;
          expect(btnDropUpElement).toBeTruthy();
          component.categoryList[0].Show = false;
          fixture.detectChanges();
          fixture.whenStable().then(() => {
            btnDropUp = fixture.debugElement.query(By.css('#arrow-up-category'));
            expect(btnDropUp).toBeNull();
          });
        });
      });

      it('Should be send to edit', () => {
        component.editCategory(component.categoryList[0]);
        expect(mockCategoriesComponent.openCategoryDialog).toHaveBeenCalled();
        expect(mockCategoriesComponent.openCategoryDialog).toHaveBeenCalledTimes(1);
      });

      it('Should be send to create', () => {
        component.createCategory(component.categoryList[0]);
        expect(mockCategoriesComponent.openCategoryDialog).toHaveBeenCalledTimes(1);
        expect(mockCategoriesComponent.openCategoryDialog).toHaveBeenCalled();
      });

    });
  });
});
