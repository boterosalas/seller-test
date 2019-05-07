import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesComponent } from './categories.component';
import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { CategoryTreeService } from '../category-tree.service';
import { LoadingService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { of } from 'rxjs';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CategoriesComponent', () => {

  const categoryRegex = [
    { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'ofertas' },
    { Identifier: 'CategoryName', Value: '^[A-Za-zÑñ\\sá é í ó ú ü ñà è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$', Module: 'parametrizacion' },
    { Identifier: 'internationalCity', Value: '^([^\/])*$', Module: 'vendedores' },
  ];

  const categoryList = [
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
      SkuShippingSize: '2',
    },
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
      SkuShippingSize: '2',
    }
  ];

  const categoryTree = [
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

  const responseRegex = {
    status: 200,
    body: {
      body: JSON.stringify({ Data: categoryRegex })
    }
  };

  const responseList = {
    status: 200,
    body: {
      body: JSON.stringify({ Data: categoryList })
    }
  };

  const categoryEmptyList = [];

  const responseEmptyList = {
    status: 200,
    body: {
      body: JSON.stringify({ Data: categoryEmptyList })
    }
  };

  const mockCategoryService = jasmine.createSpyObj('CategoryTreeService', ['getCategoryTree']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getPermissionForMenu']);
  const mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
  const mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockNgZone = jasmine.createSpyObj('NgZone', ['runOutsideAngular']);
  const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getRegexInformationBasic']);

  let spyOnDialogWithFormComponent;
  const data = {
    title: '',
    message: '',
    icon: '',
    form: null
  };

  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let dialogFixture: ComponentFixture<DialogWithFormComponent>;
  let dialogComponent: DialogWithFormComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesComponent, DialogWithFormComponent],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CategoryTreeService, useValue: mockCategoryService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: BasicInformationService, useValue: mockBasicInformationService },
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    TestBed.overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [DialogWithFormComponent]
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    dialogFixture = TestBed.createComponent(DialogWithFormComponent);
    dialogComponent = dialogFixture.componentInstance;
    mockBasicInformationService.getRegexInformationBasic.and.returnValue(of(responseRegex));
    mockAuthService.getPermissionForMenu.and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Category List with data', () => {
    beforeEach(() => {
      mockCategoryService.getCategoryTree.and.returnValue(of(responseList));
      component.getTree();
      fixture.detectChanges();
      mockMatDialogRef.componentInstance.and.returnValue(dialogComponent);
      mockMatDialog.open.and.returnValue(mockMatDialogRef);
      mockMatDialog.open.calls.reset();
    });

    it('Should be exist tree', () => {
      fixture.whenStable().then(() => {
        expect(component.categoryList).toEqual(categoryTree);
      });
    });

    it('Should be expand the tree', () => {
      component.expandTree();
      expect(component.categoryList).not.toEqual(categoryTree);
    });

    it('Should be open a dialog for a new category lvl 1', () => {
      component.openCategoryDialog(null, false);
      expect(mockMatDialog.open).toHaveBeenCalled();
    });

    it('should be contract the tree', () => {
      component.expandTree();
      expect(component.categoryList).not.toEqual(categoryTree);
      component.contractTree();
      expect(component.categoryList).toEqual(categoryTree);
    });

    it('Should be open a dialog for a new category', () => {
      component.openCategoryDialog(categoryTree[0], false);
      expect(mockMatDialog.open).toHaveBeenCalled();
    });

    it('Should be open a dialog for edit a category lvl 1', () => {
      component.openCategoryDialog(categoryTree[0], true);
      expect(mockMatDialog.open).toHaveBeenCalled();
    });

    it('Should be open a dialog for edit a category', () => {
      component.openCategoryDialog(categoryTree[0].Son[0], true);
      expect(mockMatDialog.open).toHaveBeenCalled();
    });

  });

  describe('Category List without data', () => {
    beforeEach(() => {
      mockCategoryService.getCategoryTree.and.returnValue(of(responseEmptyList));
      fixture.detectChanges();
    });
  });
});
