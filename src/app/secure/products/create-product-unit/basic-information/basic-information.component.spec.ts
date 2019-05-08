import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductBasicInfoComponent } from './basic-information.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, Validator } from '@angular/forms';
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
import { EanServicesService } from '../validate-ean/ean-services.service';

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
            Value: '^([A-Z0-9]{5,16})$'
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
            body: JSON.stringify({ Data: regex })
        }
    }

    // Mock Services

    const mockProcessService = jasmine.createSpyObj('ProcessService', ['change', 'showView', 'getViews', 'setViews', 'getProductData',]);
    const mockBasicInformationService = jasmine.createSpyObj('BasicInformationService', ['getRegexInformationBasic']);
    const mockEanService = jasmine.createSpyObj('EanServicesService', ['validateEan']);

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
                { provide: BasicInformationService, useValue: mockBasicInformationService },
                { provide: EanServicesService, useValue: mockEanService },
                { provide: FormBuilder, useValue: formBuilder }
            ],
            // No_Errors_schema (Evita errores de importación de otros Componentes)
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
        mockBasicInformationService.getRegexInformationBasic.and.returnValue(of(mockResponseRegex));
        mockEanService.validateEan.and.returnValue(of('123456789'));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProductBasicInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.formBasicInfo;

        component.newForm = new FormGroup({
            Ean: new FormControl('12344556789'),
            Size: new FormControl('2'),
            HexColorCodePDP: new FormControl('Beige'),
            HexColorCodeName: new FormControl('134556'),
            associateEanSon: new FormControl(false)
        });


    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('valid data', () => {
        component.formBasicInfo.controls.Keyword.setValue('test');
        component.formBasicInfo.controls.Name.setValue('test');
        component.formBasicInfo.controls.Category.setValue('Category');
        component.formBasicInfo.controls.shippingSize.setValue(1);
        component.formBasicInfo.controls.Model.setValue('w');
        component.formBasicInfo.controls.Brand.setValue('w');
        component.formBasicInfo.controls.Detail.setValue('w');
        component.formBasicInfo.controls.MeasurementUnit.setValue('1');
        component.formBasicInfo.controls.ConversionFactor.setValue(1);
        component.formBasicInfo.controls.Description.setValue('pruebas de texto');
        component.formBasicInfo.controls.packing['controls'].HighPacking.setValue('1');
        component.formBasicInfo.controls.packing['controls'].LongPacking.setValue('1');
        component.formBasicInfo.controls.packing['controls'].WidthPacking.setValue('1');
        component.formBasicInfo.controls.packing['controls'].WeightPacking.setValue('1');
        component.formBasicInfo.controls.product['controls'].HighProduct.setValue('1');
        component.formBasicInfo.controls.product['controls'].LongProduct.setValue('1');
        component.formBasicInfo.controls.product['controls'].WidthProduct.setValue('1');
        component.formBasicInfo.controls.product['controls'].WeightProduct.setValue('1');
    });

    //invert color

    it('padZero add color with 0', () => {
        component.padZero('prueba');
        expect(component.padZero).toBeTruthy();
    });

    it('padZero add color with 1', () => {
        component.padZero('prueba', 1);
        expect(component.padZero).toBeTruthy();
    });

    it('invert color bw true', () => {
        component.invertColor('#F5F5DC');
        expect(component.invertColor).toBeTruthy();
    });

    it('invert color bw true 3 letters', () => {
        component.invertColor('#FFF');
        expect(component.invertColor).toBeTruthy();
    });

    it('invert color bw true more than 6 letters', () => {
        expect(() => component.invertColor('#FFFFFFF')).toThrow(new Error('Invalid HEX color.'));
    });

    it('invert color no #', () => {
        component.invertColor('red');
        expect(component.invertColor).toBeTruthy();
    });

    it('invert color no hex  ', () => {
        component.invertColor('#F5F5DC', false);
        expect(component.invertColor).toBeTruthy();
    });


    it('select color  ', () => {
        component.selectColor('#F5F5DC', {});
        component.colorSelected = '#F5F5DC';
        expect(component.invertColor).toBeTruthy();
    });

    // son list


    it('add son', () => {
        component.addSon();
        fixture.detectChanges();
        expect(component.addSon).toBeTruthy();
    });

    it('show son', () => {
        component.toggleSon([]);
        expect(component.toggleSon).toBeTruthy();
    });

    it('delete Son', () => {
        component.deleteSon(1);
        expect(component.deleteSon).toBeTruthy();
    });

    // send data

    it('send Data ToService', () => {
        component.sendDataToService();
        expect(component.sendDataToService).toBeTruthy();
    });


    // keywords

    it('save keywords not keyword', () => {
        component.saveKeyword();
        expect(component.saveKeyword).toBeTruthy();
    });

    it('save keywords not keyword less than 20', () => {
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = '123kkcld4533';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.saveKeyword();
        expect(component.saveKeyword).toBeTruthy();
    });

    it('save keywords not keyword more than 20', () => {
        component.keywords = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14', '15', '16', '17', '18', '19', '20', '21'];
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = '123kkcld4533';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.saveKeyword();
        expect(component.saveKeyword).toBeTruthy();
    });

    it('save many keywords ', () => {
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = 'david, andres, raul';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.saveKeyword();
        expect(component.saveKeyword).toBeTruthy();
    });

    it('delete keywords ', () => {
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = 'david, andres, raul';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.deleteKeywork(1);
        expect(component.deleteKeywork).toBeTruthy();
    });

    it('delete keywords more than one word', () => {
        component.keywords = ['1','2','3'];
        const keywordField = fixture.debugElement.query(By.css('#keywordProduct'));
        expect(keywordField).toBeTruthy();
        const keywordNativeElement = keywordField.nativeElement;
        keywordNativeElement.value = '';
        keywordNativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.deleteKeywork(2);
        expect(component.deleteKeywork).toBeTruthy();
    });

    it('validate ean son exist', () => {
        component.valInputEan = '123456789';
        component.validateEanSon();
    });

    it('send ean son', () => {
        component.valInputEan = '123456789';
        component.sendEanSon();
    });

    it('send data ', () => {
        component.sendDataToService();
    });

    it('valid sons form', () => {
        component.getValidSonsForm();
    });

    it('send ean son', () => {
        component.valInputEan = '123456789';
        component.sendEanSon();
    });

    it('validate new son no data', () => {
        component.sonList.length = 0;
        component.validarNewSon();
    });

    it('validate new son invalid data', () => {
        const newForm = {
            form: new FormGroup({
                Ean: new FormControl('', Validators.required),
                Size: new FormControl(''),
                HexColorCodePDP: new FormControl(''),
                HexColorCodeName: new FormControl(''),
                associateEanSon: new FormControl(false)
            }),
            Show: true,
            colorPick: null,
            colorPick2: null,
        };
        component.sonList.push(newForm);
        component.validarNewSon();
    });

    it('asignated asignatedEanSon ', () => {
        component.asignatedEanSon = true;
        component.validateEanSonExist = true;
        component.valInputEan = new FormControl('');
        let initialValue = 'estoy iniciando en algo diferente';
        const eanForm = new FormControl(initialValue);
        component.onAsignatedEanSonChanged(true, eanForm);
     });

    it('asignated asignatedEanSon with valinput', () => {
        component.asignatedEanSon = true;
        component.validateEanSonExist = true;
        component.valInputEan = new FormControl('ok');
        let initialValue = 'estoy iniciando en algo diferente';
        const eanForm = new FormControl(initialValue);
        component.onAsignatedEanSonChanged(true, eanForm);
     });


    it('asignated change send son', () => {
       component.asignatedEanSon = false;
       component.validateEanSonExist = true;
       component.valInputEan = new FormControl('');
       component.onAsignatedEanSonChanged(false, '');
    });

    it('asignated change', () => {
       component.asignatedEanSon = false;
       component.validateEanSonExist = false;
       component.valInputEan = new FormControl('');
       component.onAsignatedEanSonChanged(false, '');
    });


    describe('values info basic valid inputs ', () => {

        it('name of product', () => {
            const nameProductField = fixture.debugElement.query(By.css('#nameProduct'));
            expect(nameProductField).toBeTruthy();
            const nameProductNativeElement = nameProductField.nativeElement;
            nameProductNativeElement.value = 'Secador';
            nameProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Name.errors).toBeNull();
        });

        it('category of product', () => {
            const categoryProductField = fixture.debugElement.query(By.css('#categoryProduct'));
            expect(categoryProductField).toBeTruthy();
            const categoryProductNativeElement = categoryProductField.nativeElement;
            categoryProductNativeElement.value = 'Gas';
            categoryProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Category.errors).toBeNull();
        });

        it('brand of product', () => {
            component.brands = [{ value: 'Oster' }, { value: 'Haceb' }, { value: 'Mabe' }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                const brandField = fixture.debugElement.query(By.css('#Brand'));
                expect(brandField).toBeTruthy();
                const brandNativeElement = brandField.nativeElement;
                brandNativeElement.value = brandNativeElement.options[2].value;
                brandNativeElement.dispatchEvent(new Event('change'));
                fixture.detectChanges();
                expect(component.formBasicInfo.controls.Brand.errors).toBeNull();
            });
        });

        it('measurement of product', () => {
            component.UnitMeasurementList = ['Gramo', 'Mililitro', 'Metro', 'Unidad'];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                const measurement = fixture.debugElement.query(By.css('#Brand'));
                expect(measurement).toBeTruthy();
                const measurementElement = measurement.nativeElement;
                measurementElement.value = measurementElement.options[2].value;
                measurementElement.dispatchEvent(new Event('change'));
                fixture.detectChanges();
                expect(component.formBasicInfo.controls.MeasurementUnit.errors).toBeNull();
            });
        });

        it('Conversion Factor of product', () => {
            const conversionFactorProductField = fixture.debugElement.query(By.css('#conversionFactorProduct'));
            expect(conversionFactorProductField).toBeTruthy();
            const conversionFactorProductNativeElement = conversionFactorProductField.nativeElement;
            conversionFactorProductNativeElement.value = 3;
            conversionFactorProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.ConversionFactor.errors).toBeNull();
        });

        it('model of product', () => {
            const modelProductField = fixture.debugElement.query(By.css('#modelProduct'));
            expect(modelProductField).toBeTruthy();
            const modelProductNativeElement = modelProductField.nativeElement;
            modelProductNativeElement.value = 'w';
            modelProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Model.errors).toBeNull();
        });

        it('category of product', () => {
            const keywordProductField = fixture.debugElement.query(By.css('#keywordProduct'));
            expect(keywordProductField).toBeTruthy();
            const keywordProductNativeElement = keywordProductField.nativeElement;
            keywordProductNativeElement.value = 'Gas, cocina';
            keywordProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Keyword.errors).toBeNull();
        });

        it('Detail of packing product', () => {
            const detailProductField = fixture.debugElement.query(By.css('#detailProduct'));
            expect(detailProductField).toBeTruthy();
            const detailProductNativeElement = detailProductField.nativeElement;
            detailProductNativeElement.value = 'w';
            detailProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Detail.errors).toBeNull();
        });

        it('high of packing product', () => {
            const highPackingProductField = fixture.debugElement.query(By.css('#highPackingProduct'));
            expect(highPackingProductField).toBeTruthy();
            const highPackingProductNativeElement = highPackingProductField.nativeElement;
            highPackingProductNativeElement.value = 2;
            highPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].HighProduct.errors).toBeNull();
            });
        });

        it('long of packing product', () => {
            const longPackingProductField = fixture.debugElement.query(By.css('#longPackingProduct'));
            expect(longPackingProductField).toBeTruthy();
            const longPackingProductNativeElement = longPackingProductField.nativeElement;
            longPackingProductNativeElement.value = 2;
            longPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].LongPacking.errors).toBeNull();
            });
        });

        it('width of packing product', () => {
            const widthPackingProductField = fixture.debugElement.query(By.css('#widthPackingProduct'));
            expect(widthPackingProductField).toBeTruthy();
            const widthPackingProductNativeElement = widthPackingProductField.nativeElement;
            widthPackingProductNativeElement.value = 2;
            widthPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].WidthPacking.errors).toBeNull();
            });
        });

        it('weight of packing product', () => {
            const weightPackingProductField = fixture.debugElement.query(By.css('#weightPackingProduct'));
            expect(weightPackingProductField).toBeTruthy();
            const weightPackingProductNativeElement = weightPackingProductField.nativeElement;
            weightPackingProductNativeElement.value = 2;
            weightPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].WeightPacking.errors).toBeNull();
            });
        });

        it('high of product', () => {
            const highProductField = fixture.debugElement.query(By.css('#highProduct'));
            expect(highProductField).toBeTruthy();
            const highProductNativeElement = highProductField.nativeElement;
            highProductNativeElement.value = 2;
            highProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].WeightPacking.errors).toBeNull();
            });
        });

        it('long of product', () => {
            const longProductField = fixture.debugElement.query(By.css('#longProduct'));
            expect(longProductField).toBeTruthy();
            const longProductNativeElement = longProductField.nativeElement;
            longProductNativeElement.value = 2;
            longProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].LongProduct.errors).toBeNull();
            });
        });

        it('width of product', () => {
            const widthProductField = fixture.debugElement.query(By.css('#widthProduct'));
            expect(widthProductField).toBeTruthy();
            const widthProductNativeElement = widthProductField.nativeElement;
            widthProductNativeElement.value = 2;
            widthProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].WidthProduct.errors).toBeNull();
            });
        });

        it('weight of product', () => {
            const weightProductField = fixture.debugElement.query(By.css('#weightProduct'));
            expect(weightProductField).toBeTruthy();
            const weightProductNativeElement = weightProductField.nativeElement;
            weightProductNativeElement.value = 2;
            weightProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].WeightProduct.errors).toBeNull();
            });
        });

    });

    describe('values info basic invalid inputs ', () => {

        it('name of product', () => {
            const nameProductField = fixture.debugElement.query(By.css('#nameProduct'));
            expect(nameProductField).toBeTruthy();
            const nameProductNativeElement = nameProductField.nativeElement;
            nameProductNativeElement.value = 'x+*';
            nameProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Name.errors).toBeTruthy();
        });

        it('category of product', () => {
            const categoryProductField = fixture.debugElement.query(By.css('#categoryProduct'));
            expect(categoryProductField).toBeTruthy();
            const categoryProductNativeElement = categoryProductField.nativeElement;
            categoryProductNativeElement.value = '';
            categoryProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Category.errors).toBeNull();
        });

        it('brand of product', () => {
            component.brands = [{ value: 'Oster' }, { value: 'Haceb' }, { value: 'Mabe' }];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                const brandField = fixture.debugElement.query(By.css('#Brand'));
                expect(brandField).toBeTruthy();
                const brandNativeElement = brandField.nativeElement;
                brandNativeElement.value = brandNativeElement.options[5].value;
                brandNativeElement.dispatchEvent(new Event('change'));
                fixture.detectChanges();
                expect(component.formBasicInfo.controls.Brand.errors).toBeTruthy();
            });
        });

        it('measurement of product', () => {
            component.UnitMeasurementList = ['Gramo', 'Mililitro', 'Metro', 'Unidad'];
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                const measurement = fixture.debugElement.query(By.css('#Brand'));
                expect(measurement).toBeTruthy();
                const measurementElement = measurement.nativeElement;
                measurementElement.value = measurementElement.options[10].value;
                measurementElement.dispatchEvent(new Event('change'));
                fixture.detectChanges();
                expect(component.formBasicInfo.controls.MeasurementUnit.errors).toBeTruthy();
            });
        });

        it('Conversion Factor of product', () => {
            const conversionFactorProductField = fixture.debugElement.query(By.css('#conversionFactorProduct'));
            expect(conversionFactorProductField).toBeTruthy();
            const conversionFactorProductNativeElement = conversionFactorProductField.nativeElement;
            conversionFactorProductNativeElement.value = 'hola';
            conversionFactorProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.ConversionFactor.errors).toBeTruthy();
        });

        it('model of product', () => {
            const modelProductField = fixture.debugElement.query(By.css('#modelProduct'));
            expect(modelProductField).toBeTruthy();
            const modelProductNativeElement = modelProductField.nativeElement;
            modelProductNativeElement.value = 'test';
            modelProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Model.errors).toBeTruthy();
        });

        it('category of product', () => {
            const keywordProductField = fixture.debugElement.query(By.css('#keywordProduct'));
            expect(keywordProductField).toBeTruthy();
            const keywordProductNativeElement = keywordProductField.nativeElement;
            keywordProductNativeElement.value = '';
            keywordProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Keyword.errors).toBeTruthy();
        });

        it('Detail of packing product', () => {
            const detailProductField = fixture.debugElement.query(By.css('#detailProduct'));
            expect(detailProductField).toBeTruthy();
            const detailProductNativeElement = detailProductField.nativeElement;
            detailProductNativeElement.value = 'test';
            detailProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect(component.formBasicInfo.controls.Detail.errors).toBeTruthy();
        });

        it('high of packing product', () => {
            const highPackingProductField = fixture.debugElement.query(By.css('#highPackingProduct'));
            expect(highPackingProductField).toBeTruthy();
            const highPackingProductNativeElement = highPackingProductField.nativeElement;
            highPackingProductNativeElement.value = 'test';
            highPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].HighProduct.errors).toBeTruthy();
            });
        });

        it('long of packing product', () => {
            const longPackingProductField = fixture.debugElement.query(By.css('#longPackingProduct'));
            expect(longPackingProductField).toBeTruthy();
            const longPackingProductNativeElement = longPackingProductField.nativeElement;
            longPackingProductNativeElement.value = 'test';
            longPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].LongPacking.errors).toBeTruthy();
            });
        });

        it('width of packing product', () => {
            const widthPackingProductField = fixture.debugElement.query(By.css('#widthPackingProduct'));
            expect(widthPackingProductField).toBeTruthy();
            const widthPackingProductNativeElement = widthPackingProductField.nativeElement;
            widthPackingProductNativeElement.value = 'test';
            widthPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].WidthPacking.errors).toBeTruthy();
            });
        });

        it('weight of packing product', () => {
            const weightPackingProductField = fixture.debugElement.query(By.css('#weightPackingProduct'));
            expect(weightPackingProductField).toBeTruthy();
            const weightPackingProductNativeElement = weightPackingProductField.nativeElement;
            weightPackingProductNativeElement.value = 'test';
            weightPackingProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.packing['controls'].WeightPacking.errors).toBeTruthy();
            });
        });

        it('high of product', () => {
            const highProductField = fixture.debugElement.query(By.css('#highProduct'));
            expect(highProductField).toBeTruthy();
            const highProductNativeElement = highProductField.nativeElement;
            highProductNativeElement.value = 'test';
            highProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].WeightPacking.errors).toBeTruthy();
            });
        });

        it('long of product', () => {
            const longProductField = fixture.debugElement.query(By.css('#longProduct'));
            expect(longProductField).toBeTruthy();
            const longProductNativeElement = longProductField.nativeElement;
            longProductNativeElement.value = 'test';
            longProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].LongProduct.errors).toBeTruthy();
            });
        });

        it('width of product', () => {
            const widthProductField = fixture.debugElement.query(By.css('#widthProduct'));
            expect(widthProductField).toBeTruthy();
            const widthProductNativeElement = widthProductField.nativeElement;
            widthProductNativeElement.value = 'test';
            widthProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].WidthProduct.errors).toBeTruthy();
            });
        });

        it('weight of product', () => {
            const weightProductField = fixture.debugElement.query(By.css('#weightProduct'));
            expect(weightProductField).toBeTruthy();
            const weightProductNativeElement = weightProductField.nativeElement;
            weightProductNativeElement.value = 'test';
            weightProductNativeElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                tick();
                expect(component.formBasicInfo.controls.product['controls'].WeightProduct.errors).toBeTruthy();
            });
        });

    });

});
