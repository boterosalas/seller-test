import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesComponent } from './categories.component';
import { NO_ERRORS_SCHEMA, NgZone } from '@angular/core';
import { CategoryTreeService } from '../category-tree.service';
import { LoadingService, ModalService } from '@app/core';
import { AuthService } from '@app/secure/auth/auth.routing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { DialogWithFormComponent } from '@app/shared/components/dialog-with-form/dialog-with-form.component';
import { of } from 'rxjs';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateProcessDialogComponent } from '../../../../shared/components/create-process-dialog/create-process-dialog.component';

describe('CategoriesComponent', () => {

  const categoryRegex = [
    { Identifier: 'formatNumber', Value: '^[0-9]+([.][0-9]{2})?$', Module: 'ofertas' },
    { Identifier: 'CategoryName', Value: '^[A-Za-zÑñ\\sá é í ó ú ü ñà è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$', Module: 'parametrizacion' },
    { Identifier: 'internationalLocation', Value: '^([^\/])*$', Module: 'vendedores' },
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
      Son: [
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
    status: 400,
    body: {
      body: JSON.stringify({ Data: categoryEmptyList })
    }
  };

  const responseStatus = {
    status: 200,
    body: {
      statusCode: 200,
      body: JSON.stringify({
        Data: {
          Status: 0
        }
      })
    }
  };

  const mockCategoryService = jasmine.createSpyObj('CategoryTreeService', ['getCategoryTree', 'verifyStatusOfCreateCategory']);
  const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner']);
  const mockAuthService = jasmine.createSpyObj('AuthService', ['getPermissionForMenu']);
  const mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
  const mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed', 'componentInstance']);
  const mockNgZone = jasmine.createSpyObj('NgZone', ['runOutsideAngular']);
  const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getRegexInformationBasic']);
  const mockDialogError = jasmine.createSpyObj('ModalService', ['showModal']);

  const data = {
    title: '',
    message: '',
    icon: '',
    form: null,
    showButtons: true,
    btnConfirmationText: null
  };

  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;
  let dialogFixture: ComponentFixture<DialogWithFormComponent>;
  let dialogComponent: DialogWithFormComponent;
  let dialogProcessFixture: ComponentFixture<CreateProcessDialogComponent>;
  let dialogProcessComponent: CreateProcessDialogComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesComponent, DialogWithFormComponent, CreateProcessDialogComponent],
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
        { provide: ModalService, useValue: mockDialogError },
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
    dialogProcessFixture = TestBed.createComponent(CreateProcessDialogComponent);
    dialogProcessComponent = dialogProcessFixture.componentInstance;
    mockBasicInformationService.getRegexInformationBasic.and.returnValue(of(responseRegex));
    mockAuthService.getPermissionForMenu.and.returnValue(true);
    mockCategoryService.verifyStatusOfCreateCategory.and.returnValue(of(responseStatus));
    mockMatDialogRef.afterClosed.and.returnValue(of(null));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Category List with data', () => {
    beforeEach(() => {
      mockCategoryService.getCategoryTree.and.returnValue(of(responseList));
      mockMatDialogRef.componentInstance.and.returnValue(dialogComponent);
      mockMatDialog.open.and.returnValue(mockMatDialogRef);
      mockMatDialog.open.calls.reset();
      fixture.detectChanges();
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

    it('should be update a category', () => {
      component.categoryToUpdate = categoryList[1];
      const value = {
        Commission: 15,
        Id: 27177,
        IdCarulla: null,
        IdCatalogos: null,
        IdExito: 'catmp1000000000',
        IdMarketplace: 'catmp1000000000',
        IdParent: 27176,
        IdVTEX: null,
        Name: 'Nacionales',
        ProductType: 'Technology'
      };
      component.confirmationUpdate(value);
      expect(component.categoryList).not.toEqual(categoryTree);
    });

    it('Should e exist Comission', () => {
      expect(component.Commission).toBeTruthy();
    });

    it('Should e exist Id', () => {
      expect(component.Id).toBeTruthy();
    });

    it('Should e exist IdCarulla', () => {
      expect(component.IdCarulla).toBeTruthy();
    });

    it('Should e exist IdCatalogos', () => {
      expect(component.IdCatalogos).toBeTruthy();
    });

    it('Should e exist IdExito', () => {
      expect(component.IdExito).toBeTruthy();
    });

    it('Should e exist IdMarketplace', () => {
      expect(component.IdMarketplace).toBeTruthy();
    });

    it('Should e exist IdParent', () => {
      expect(component.IdParent).toBeTruthy();
    });

    it('Should e exist NameParent', () => {
      expect(component.NameParent).toBeTruthy();
    });

    it('Should e exist Name', () => {
      expect(component.Name).toBeTruthy();
    });

    it('Should e exist ProductType', () => {
      expect(component.ProductType).toBeTruthy();
    });

    it('Should e exist IdVTEX', () => {
      expect(component.IdVTEX).toBeTruthy();
    });

    describe('With creation in batch', () => {
      beforeEach(() => {
        const newResponseStatus = {
          statusCode: 200,
          body: {
            body: JSON.stringify({
              Data: {
                Status: 1
              }
            })
          }
        };
        mockCategoryService.verifyStatusOfCreateCategory.and.returnValue(of(newResponseStatus));
        mockMatDialogRef.componentInstance.and.returnValue(dialogProcessComponent);
      });

      it('Shoud be OpenModal for creating in batch', () => {
        component.ngOnInit();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
          expect(mockCategoryService.verifyStatusOfCreateCategory).toHaveBeenCalled();
        });
      });
    });
  });

  describe('Category without data', () => {
    beforeEach(() => {
      mockCategoryService.getCategoryTree.and.returnValue(of(responseEmptyList));
      const newResponseRegex = {
        status: 200,
        body: {
          body: JSON.stringify({ Data: [] })
        }
      };
      mockBasicInformationService.getRegexInformationBasic.and.returnValue(of(newResponseRegex));
      mockAuthService.getPermissionForMenu.and.returnValue(true);
      mockCategoryService.verifyStatusOfCreateCategory.and.returnValue(of(responseStatus));
      mockMatDialogRef.afterClosed.and.returnValue(of(null));
      mockDialogError.showModal.calls.reset();
    });

    it('Should be faild ngOnInit, call modalService 3 times', () => {
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(mockDialogError.showModal).toHaveBeenCalled();
        expect(mockDialogError.showModal).toHaveBeenCalledTimes(4);
      });
    });

  });
});
