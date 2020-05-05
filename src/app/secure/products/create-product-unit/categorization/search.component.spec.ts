import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { MaterialModule } from '@app/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { LoadingService } from '@app/core';

import { SearchCategorizationComponent } from './search.component';
import { SearchService } from './search.component.service';
import { ListCategorizationComponent } from './list/list.component';
import { ProcessService } from '../component-process/component-process.service';
import { TreeComponent } from './list/tree.component';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('Probando componentes relacionados con la busqueda y seleccion de categoria en creación de producto unitario.', () => {

    let fixture: ComponentFixture<SearchCategorizationComponent>;
    let component: SearchCategorizationComponent;

    let componentList: ListCategorizationComponent;
    let fixtureList: ComponentFixture<ListCategorizationComponent>;

    let componentTree: TreeComponent;
    let fixtureTree: ComponentFixture<TreeComponent>;
    const eventEmitter = new EventEmitter();

    const categories = '[{"Id":27316,"IdParent":27195,"Name":"A Gas","IdExito":"cat790026000","IdCarulla":"567_300030040000000","IdCatalogos":"k_900010000000000","IdMarketplace":"catmp1111000000","ProductType":"Technology"' +
        ',"SkuShippingSize":"5","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27352,"IdParent":27231,"Name":"Abdominales","IdExito":"35_900120030040000","IdCarulla":"567_300030010060000","IdCatalogos":"k_900020020000000"' +
        ',"IdMarketplace":"catmp1141000000","ProductType":"Technology","SkuShippingSize":"4","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":271576,"IdParent":27176,"Name":"Academicos","IdExito":"35_140030020000000",' +
        '"IdCarulla":"cat3841598","IdCatalogos":"k_900020000000000","IdMarketplace":"catmp1542000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27840,"IdParent":27508,' +
        '"Name":"Accesorios","IdExito":"cat4620017","IdCarulla":"567_100040010050000","IdCatalogos":"cat6600093","IdMarketplace":"catmp1370000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5",' +
        '"IsExitoShipping":true,"Commission":16.0},{"Id":27353,"IdParent":27208,"Name":"Accesorios","IdExito":"35_190060000000000","IdCarulla":"cat6290030","IdCatalogos":"k_190060000000000","IdMarketplace":"catmp1161000000",' +
        '"ProductType":"Technology","SkuShippingSize":"3","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":14.0},{"Id":27275,"IdParent":27239,"Name":"Accesorios","IdExito":"35_300030160000000","IdCarulla":"567_400090010000000",' +
        '"IdCatalogos":"cat4220042","IdMarketplace":"catmp1671000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":20.0},{"Id":28105,"IdParent":27698,"Name":"Accesorios","IdExito":"cat6890022"' +
        ',"IdCarulla":"567_300010030010050","IdCatalogos":"k_200040040000000","IdMarketplace":"catmp1841000000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27891,' +
        '"IdParent":27307,"Name":"Accesorios","IdExito":"35_900020030000000","IdCarulla":"567_300030030000000","IdCatalogos":"k_900020000000000","IdMarketplace":"catmp1139100000","ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5",' +
        '"IsExitoShipping":true,"Commission":15.0},{"Id":27692,"IdParent":27218,"Name":"Accesorios","IdExito":"cat3461516","IdCarulla":"567_300010010040000","IdCatalogos":"k_200060000000000","IdMarketplace":"catmp1881000000","ProductType":"Technology",' +
        '"SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0},{"Id":27176,"IdParent":null,"Name":"Marketplace","IdExito":"catmp0000000000","IdCarulla":null,"IdCatalogos":null,"IdMarketplace":"catmp0000000000",' +
        '"ProductType":"Technology","SkuShippingSize":"2","Promisedelivery":"2 a 5","IsExitoShipping":true,"Commission":15.0}]';

    const treeData = [{Id : 1, Name: 'Test 1', Son : [{ Id : 2, Name: 'Test 2', Son : [], ModifyName: 'Test'}] }];

    const structureJson = {
        statusCode: 200,
        status: 200,
        body: { body: '{ "Data": ' + categories + ' } ' }
    };

    const searchService = <SearchService>{
        getCategories(): Observable<{}> {
            return of(structureJson);
        },
        getCategory(): Observable<any> {
            return of(null); // functions empty
        },
        setCategory(category: string): void {
            // functions empty
        },
        change: eventEmitter
    };

    const processService = <ProcessService>{
        validaData(data: any): void {
            // nothing to do here
        }
    };
    const mockLoadingService = jasmine.createSpyObj('LoadingService', ['viewSpinner', 'closeSpinner', 'viewProgressBar', 'closeProgressBar']);

    beforeEach(fakeAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchCategorizationComponent,
                ListCategorizationComponent,
                TreeComponent
            ],
            providers: [
                { provide: SearchService, useValue: searchService },
                { provide: ProcessService, useValue: processService },
                { provide: LoadingService, useValue: mockLoadingService },
            ], imports: [
                MaterialModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                FormsModule,
                BrowserAnimationsModule,
                SharedModule,
                HttpClientTestingModule
            ]
        }).compileComponents();
    }));

    beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(SearchCategorizationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('Deberia crear SearchCategorizationComponent', (done) => {
        expect(component).toBeTruthy();
        done();
    });

    it('Deberia obtener el valor searchText del searchTextInput.', (done) => {
        const field: HTMLInputElement = fixture.debugElement.query(By.css('#input-search')).nativeElement;
        field.value = 'gas';
        field.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        component.searchText = 'gas';
        expect(component.searchText).toBe('gas');
        done();
      });

    it('Deberia obtener el valor searchText del searchTextInput sin name', (done) => {
        const mockEvent = new Event('click');
        component.searchTextInput = {};
        component.searchTextInput = 'gas';
        component.keyDownFunction(mockEvent);
        expect(component.searchText).toBe(component.searchTextInput);
        done();
    });

    it('Deberia mediante la funcion whatchValueInput guardar el valor de searchTextInput', (done) => {
        const event = 'gas';
        component.keyDownFunction(event);
        expect(component.searchTextInput).toBe(event);
        done();
    });

    it('Deberia realizar el log de obtener las categorias', (done) => {
        component.listCategories = undefined;
        structureJson.status = 400;
        structureJson.statusCode = 400;
        component.getCategoriesList();
        expect(component.listCategories).toBeUndefined();
        structureJson.status = 200;
        structureJson.statusCode = 200;
        done();
    });

    it('Deberia filtrar la lista', () => {
        component._filterStates('gas');
        expect(component.listCategories[0].Name).toBe('A Gas');
    });

    beforeEach(() => {
        fixtureList = TestBed.createComponent(ListCategorizationComponent);
        componentList = fixtureList.componentInstance;
        fixtureList.detectChanges();
    });

    it('Deberia crear ListCategorizationComponent', () => {
        expect(componentList).toBeTruthy();
    });

    it('Deberia poner la variable openAllItems (false)', () => {
        componentList.openAll();
        expect(componentList.openAllItems).toBeTruthy();
    });

    it('Deberia inicializar la lista y encontrar palabras en esta', () => {
        componentList.openAll();
        componentList.showOnlyWithSon();

        componentList.searchText = 'market';
        componentList.organizedLisSearchText(componentList.listCategories);
        // expect(componentList.listCategories[0].Show).toBeTruthy();

        componentList.searchText = 'academi';
        componentList.organizedLisSearchText(componentList.listCategories);

        // expect(componentList.listCategories[0].Son[0].Show).toBeTruthy();
    });

    beforeEach(() => {
        fixtureTree = TestBed.createComponent(TreeComponent);
        componentTree = fixtureTree.componentInstance;
        fixtureTree.detectChanges();
    });

    it('Deberia abrir en el arbol el primer elemento.', () => {
        expect(componentTree).toBeTruthy();
        componentTree.treeData = treeData;
        componentTree.openSonClick(treeData[0]);
        expect(componentTree.treeData[0].Show).toBeTruthy();
    });

    it('Deberia obtener de margin 2', () => {
        expect(componentTree).toBeTruthy();
        componentTree.treeData = treeData;
        componentTree.margin = null;
        componentTree.ngOnInit();
        componentTree.getName(treeData[0].Son[0]);
        componentTree.getMargin(treeData[0].Son[0]);
        expect(componentTree.margin).toBe(2);
    });




});
