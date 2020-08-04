import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandedPendingProductsComponent } from './expanded-pending-products.component';
import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '@app/shared/shared.module';
import { MatSnackBarModule } from '@angular/material';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { UserParametersService } from '@app/core';
import { of } from 'rxjs';

const data = {
    sellerId: '11618',
    sellerProfile: 'seller',
    sellerNit: '123',
    sellerName: 'la tienda de cristian 2019 vs 512',
    sellerEmail: 'ccbustamante221@misena.edu.co',
};

const result = {
    availableToOffer: false,
    bestOffer: null,
    brand: '1A',
    category: '50195',
    colour: 'Beige',
    createdDate: '31/07/2020',
    description: '1',
    ean: 'IZ20000065877',
    eanesCombos: null,
    features: [],
    isMarketplace: true,
    isProcessed: false,
    item_height: 1,
    item_length: 1,
    item_weight: 1,
    item_width: 1,
    keyword: ['1'],
    mediumImage: ['https://teknopolis.vteximg.com.br/arquivos/ids/181738-1000-1000/17478.jpg', 'https://teknopolis.vteximg.com.br/arquivos/ids/181738-1000-1000/17478.jpg'],
    model: '1',
    name: '1',
    package_height: 1,
    package_length: 1,
    package_weight: 1,
    package_width: 1,
    pluVtex: null,
    reference: '',
    shipping_size: 1,
    size: '',
    smallImage: ['https://teknopolis.vteximg.com.br/arquivos/ids/181738-1000-1000/17478.jpg', 'https://teknopolis.vteximg.com.br/arquivos/ids/181738-1000-1000/17478.jpg'],
    updatedDate: '31/07/2020',
    urlImage: 'https://teknopolis.vteximg.com.br/arquivos/ids/181738-1000-1000/17478.jpg',
};
fdescribe('ExpandedPendingProductsComponent', () => {
    let component: ExpandedPendingProductsComponent;
    let fixture: ComponentFixture<ExpandedPendingProductsComponent>;

    const mockUserParameterService = jasmine.createSpyObj('UserParametersService', ['getUserData']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                ReactiveFormsModule,
                FormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientModule,
                SharedModule,
                MatSnackBarModule,
            ],
            declarations: [ExpandedPendingProductsComponent],
            providers: [
                { provide: UserParametersService, useValue: mockUserParameterService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExpandedPendingProductsComponent);
        mockUserParameterService.getUserData.and.returnValue(of(data));
        component = fixture.componentInstance;
        component.productsPendindgExpanded = result;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('functions of components', () => {
        console.log('res: ', result);
        component.avaibleProductPending = true;
        component.editProduct(result);
        component.createArrayImages();
    });
});
