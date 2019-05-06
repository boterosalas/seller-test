import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ProductBasicInfoComponent } from './basic-information.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule, MatSelectModule, MatSliderModule, MatStepperModule, MatIconModule, MatDividerModule, MatCheckboxModule, MatTooltipModule, MatSnackBar, MatSnackBarModule, MatInputModule } from '@angular/material';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ColorPickerModule } from 'ngx-color-picker';
import { BasicInformationService } from './basic-information.component.service';
import { HttpClientModule } from '@angular/common/http';
import { EndpointService } from '@app/core';
import { ProcessService } from '../component-process/component-process.service';
import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('ProductBasicInfoComponent', () => {
    let component: ProductBasicInfoComponent;
    let fixture: ComponentFixture<ProductBasicInfoComponent>;
    const regex = [
        {
            Identifier: 'nameProduct',
            Value: '^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ+\-\,\.\s]{1,60}$'
        },
        {
            Identifier: 'modelProduct',
            Value: '^[\w\W\s\d]{1,29}$'
        },
        {
            Identifier: 'brandProduct',
            Value: '^[\w\W\s\d]{1,200}$'
        },
        {
            Identifier: 'detailProduct',
            Value: '^[\w\W\s\d]{1,29}$'
        },
        {
            Identifier: 'factConversionProduct',
            Value: '^(([1-9][0-9]{0,10})|([1-9][0-9]{0,8}([,\.][0-9]{1}))|(([0-9]([0-9]{0,7}([,\.][0-9]{2})|([,\.][1-9]{1})))))?$'
        },
        {
            Identifier: 'decimalsProduct',
            Value: '^(([1-9][0-9]{0,10})|([1-9][0-9]{0,8}([,][0-9]{1}))|(([0-9]([0-9]{0,7}([,][0-9]{2})|([,][1-9]{1})))))?$'
        },
        {
            Identifier: 'ean',
            Value: ''
        },
        {
            Identifier: 'sizeProduct',
            Value: '^([A-Z0-9]{5,16})$'
        },
        {
            Identifier: 'hexColorNameProduct',
            Value: '^(\S){1,200}$'
        }
    ]
    const mockResponseRegex = {
        body: {
            body: JSON.stringify({Data: regex})
        }
    }

    // Mock Services

    const mockProcessService = jasmine.createSpyObj('ProcessService', ['change','showView','getViews','setViews', 'getProductData', ]);
    const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getRegexInformationBasic']);

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
                MatSnackBarModule,
                MatInputModule,
                NoopAnimationsModule
            ],
            declarations: [
                ProductBasicInfoComponent
            ],
            providers: [
                EndpointService,
                ProcessService,
                // { provide: ProcessService, useValue: mockProcessService },
                // BasicInformationService,
                { provide: BasicInformationService, useValue: mockBasicInformationService },
                { provide: FormBuilder, useValue: formBuilder }
            ],
            // No_Errors_schema (Evita errores de importación de otros Componentes)
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
            // mockProcessService.getProductData.and.returnValue(of(data));
            // mockProcessService.setViews.and.returnValue(of(views));
            // mockProcessService.getViews.and.returnValue(of(views));
            // mockProcessService.showView.and.returnValue(of(views));
            // mockProcessService.change.and.returnValue(of(views));
            mockBasicInformationService.getRegexInformationBasic.and.returnValue(of(mockResponseRegex));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductBasicInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.formBasicInfo;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    //invert color

    it('padZero', () => {
        component.padZero('prueba');
    });

    it('invert color bw true', () => {
        component.invertColor('#F5F5DC');
    });

    it('invert color bw true 3 letters', () => {
        component.invertColor('#FFF');
    });

    it('invert color bw true more than 6 letters', () => {
        expect(() => component.invertColor('#FFFFFFF')).toThrow(new Error('Invalid HEX color.'));
    });

    it('invert color no #', () => {
        component.invertColor('red');
    });

    it('invert color no hex  ', () => {
        component.invertColor('#F5F5DC', false);
    });

    
    it('select color  ', () => {
        component.selectColor('#F5F5DC', {});
        component.colorSelected = '#F5F5DC';
    });

    // son list


    it('add son', () => {

        component.newForm = new FormGroup({
            Ean: new FormControl ('12344556789'),
            Size: new FormControl ('2'),
            HexColorCodePDP: new FormControl ('Beige'),
            HexColorCodeName: new FormControl ('134556'),
            associateEanSon:new FormControl (false)
        });

        fixture.detectChanges();
        component.addSon();
    });

    it('show son', () => {
        component.toggleSon([]);
    });

    it('delete Son', () => {
        component.deleteSon(1);
    });

    // send data

    it('send Data ToService', () => {
        component.sendDataToService();
    });


    // keywords

    it('save keywords not keyword', () => {
        component.saveKeyword();
    });

    it('save keywords not keyword less than 20', () => {
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = '123kkcld4533';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.saveKeyword();
    });

    it('save many keywords ', () => {
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = 'david, andres, raul';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.saveKeyword();
    });

    it('delete keywords ', () => {
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = 'david, andres, raul';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.deleteKeywork(1);
    });



    // it('show son', () => {
    //     component.toggleSon(true);
    //     expect(component.toggleSon).toBeTruthy();
    // });

    



});

