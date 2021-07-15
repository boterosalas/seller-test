// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { RouterTestingModule } from '@angular/router/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HttpClientModule } from '@angular/common/http';
// import { MaterialModule } from '@app/material.module';
// import { SearchCategorizationComponent } from './search.component';
// import { SearchService } from './search.component.service';
// import { SharedModule } from '@app/shared/shared.module';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { of } from 'rxjs';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { By } from '@angular/platform-browser';

// describe('ReportCommissionComponent', () => {
//     const mockCategoryService = jasmine.createSpyObj('SearchService', ['getCategories', 'getCategory', 'setCategory']);
//     let component: SearchCategorizationComponent;
//     let fixture: ComponentFixture<SearchCategorizationComponent>;

//     const categories = '[{"Id":27316,"IdParent":27195,"Name":"A Gas","IdExito":"cat790026000","IdCarulla":"567_300030040000000","IdCatalogos":"k_900010000000000","IdMarketplace":"catmp1111000000","ProductType":"Technology"' +
//         ',"SkuShippingSize":"5","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27352,"IdParent":27231,"Name":"Abdominales","IdExito":"35_900120030040000","IdCarulla":"567_300030010060000","IdCatalogos":"k_900020020000000"' +
//         ',"IdMarketplace":"catmp1141000000","ProductType":"Technology","SkuShippingSize":"4","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":271576,"IdParent":27176,"Name":"Academicos","IdExito":"35_140030020000000",' +
//         '"IdCarulla":"cat3841598","IdCatalogos":"k_900020000000000","IdMarketplace":"catmp1542000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27840,"IdParent":27508,' +
//         '"Name":"Accesorios","IdExito":"cat4620017","IdCarulla":"567_100040010050000","IdCatalogos":"cat6600093","IdMarketplace":"catmp1370000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5",' +
//         '"IsExitoShipping":true,"Commission":16.0},{"Id":27353,"IdParent":27208,"Name":"Accesorios","IdExito":"35_190060000000000","IdCarulla":"cat6290030","IdCatalogos":"k_190060000000000","IdMarketplace":"catmp1161000000",' +
//         '"ProductType":"Technology","SkuShippingSize":"3","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":14.0},{"Id":27275,"IdParent":27239,"Name":"Accesorios","IdExito":"35_300030160000000","IdCarulla":"567_400090010000000",' +
//         '"IdCatalogos":"cat4220042","IdMarketplace":"catmp1671000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":20.0},{"Id":28105,"IdParent":27698,"Name":"Accesorios","IdExito":"cat6890022"' +
//         ',"IdCarulla":"567_300010030010050","IdCatalogos":"k_200040040000000","IdMarketplace":"catmp1841000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27891,' +
//         '"IdParent":27307,"Name":"Accesorios","IdExito":"35_900020030000000","IdCarulla":"567_300030030000000","IdCatalogos":"k_900020000000000","IdMarketplace":"catmp1139100000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5",' +
//         '"IsExitoShipping":true,"Commission":15.0},{"Id":27692,"IdParent":27218,"Name":"Accesorios","IdExito":"cat3461516","IdCarulla":"567_300010010040000","IdCatalogos":"k_200060000000000","IdMarketplace":"catmp1881000000","ProductType":"Technology",' +
//         '"SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27176,"IdParent":null,"Name":"Marketplace","IdExito":"catmp0000000000","IdCarulla":null,"IdCatalogos":null,"IdMarketplace":"catmp0000000000",' +
//         '"ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0}]';

//     const structureJson = {
//         statusCode: 200,
//         status: 200,
//         body: { body: '{ "Data": ' + categories + ' } ' }
//     };


//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 MaterialModule,
//                 ReactiveFormsModule,
//                 FormsModule,
//                 RouterTestingModule,
//                 BrowserAnimationsModule,
//                 HttpClientModule,
//                 SharedModule
//             ],
//             declarations: [SearchCategorizationComponent],
//             providers: [
//                 { provide: SearchService, useValue: mockCategoryService },
//                 MaterialModule,
//                 MatFormFieldModule,
//                 ReactiveFormsModule,
//                 FormsModule,
//                 BrowserAnimationsModule,
//                 SharedModule,
//                 HttpClientTestingModule
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
//         }).compileComponents();
//     }));

//     beforeEach(() => {
//         fixture = TestBed.createComponent(SearchCategorizationComponent);
//         mockCategoryService.getCategories.and.returnValue(of(structureJson));
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
//     it('Deberia obtener el valor searchText del searchTextInput.', (done) => {
//         const field: HTMLInputElement = fixture.debugElement.query(By.css('#input-search')).nativeElement;
//         field.value = 'gas';
//         field.dispatchEvent(new Event('input'));
//         fixture.detectChanges();
//         component.searchText = 'gas';
//         expect(component.searchText).toBe('gas');
//         done();
//     });

//     it('Deberia obtener el valor searchText del searchTextInput sin name', (done) => {
//         const mockEvent = new Event('click');
//         component.searchTextInput = {};
//         component.searchTextInput = 'gas';
//         component.keyDownFunction(mockEvent);
//         expect(component.searchText).toBe(component.searchTextInput);
//         done();
//     });

//     it('Deberia mediante la funcion whatchValueInput guardar el valor de searchTextInput', (done) => {
//         const event = 'gas';
//         component.keyDownFunction(event);
//         expect(component.searchTextInput).toBe(event);
//         done();
//     });

//     it('Deberia realizar el log de obtener las categorias', (done) => {
//         component.listCategories = undefined;
//         structureJson.status = 400;
//         structureJson.statusCode = 400;
//         component.getCategoriesList();
//         expect(component.listCategories).toBeUndefined();
//         structureJson.status = 200;
//         structureJson.statusCode = 200;
//         done();
//     });

//     it('Deberia filtrar la lista', () => {
//         component._filterStates('gas');
//         expect(component.listCategories[0].Name).toBe('A Gas');
//     });
//     afterAll(() => {
//         TestBed.resetTestingModule();
//     });
// });