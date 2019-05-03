import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductBasicInfoComponent } from './basic-information.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule, MatSelectModule, MatSliderModule, MatStepperModule, MatIconModule, MatDividerModule, MatCheckboxModule, MatTooltipModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ColorPickerModule } from 'ngx-color-picker';
import { BasicInformationService } from './basic-information.component.service';
import { HttpClientModule } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { ProcessService } from '../component-process/component-process.service';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';

fdescribe('ProductBasicInfoComponent', () => {
    let component: ProductBasicInfoComponent;
    let fixture: ComponentFixture<ProductBasicInfoComponent>;

    // Mock Services

    const mockProcessService = jasmine.createSpyObj('ProcessService', ['change', 'getProductData', 'setViews']); 

    // create new instance of FormBuilder
    const formBuilder: FormBuilder = new FormBuilder();

    // data formulario

    let views = {
        showEan: true,
        showCat: false,
        showInfo: true,
        showSpec: true,
        showImg: true,
    };

    let data = {
        Ean: null,
        AssignEan: null,
        Category: null,
        CategoryName: null,
        ProductType: null,
        HasEAN: false,
        Name: null,
        Brand: null,
        Details: null,
        Seller: 'Marketplace',
        Model: null,
        SkuShippingSize: null,
        PackageWidth: null,
        PackageHeight: null,
        PackageLength: null,
        PackageWeight: null,
        ProductWidth: null,
        ProductHeight: null,
        ProductLength: null,
        ProductWeight: null,
        Description: null,
        KeyWords: null,
        Children: null,
        Size: null,
        Color: null,
        HexColourCodePDP: null,
        HexColourName: null,
        ConversionFactor: null,
        MeasurementUnit: null,
        Features: null,
        ImageUrl1: null,
        ImageUrl2: null,
        ImageUrl3: null,
        ImageUrl4: null,
        ImageUrl5: null,
        MetaTitle: null,
        MetaDescription: null
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatOptionModule,
                MatSelectModule,
                MatSliderModule,
                MatStepperModule,
                AngularEditorModule,
                MatIconModule,
                MatDividerModule,
                MatCheckboxModule,
                MatTooltipModule,
                ColorPickerModule,
                HttpClientModule,
                MatSnackBarModule
            ],
            declarations: [
                ProductBasicInfoComponent
            ],
            providers: [
                EndpointService,
                // ProcessService,
                { provide: ProcessService, useValue: mockProcessService },
                BasicInformationService,
                { provide: FormBuilder, useValue: formBuilder }
            ],
            // No_Errors_schema (Evita errores de importación de otros Componentes)
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
            mockProcessService.getProductData.and.returnValue(of(data));
            mockProcessService.setViews.and.returnValue(of(views));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductBasicInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});

