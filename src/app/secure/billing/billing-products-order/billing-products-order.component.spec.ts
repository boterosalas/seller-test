/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { BillingModule } from '../billing.module';
import { BillingProductsOrderComponent } from './billing-products-order.component';
import { MatSidenavModule } from '@angular/material';
import { ShellModule } from '@app/core/shell/shell.module';
import { By } from '@angular/platform-browser';


describe('BillingProductsOrderComponent', () => {
  let component: BillingProductsOrderComponent;
  let fixture: ComponentFixture<BillingProductsOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BillingModule,
        MatSidenavModule,
        ShellModule
      ],
      declarations: [
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingProductsOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('With order', () => {
    beforeEach(() => {
      component.order = [{
        detailName: 'Videojuego Grand Theft Auto V PS4',
        ean: 'MP02080000000035',
        quantity: '1',
        totalShippingCost: '2731',
        price: '104900'
      }];
    });

    it('open modal', () => {
      component.openModalDetailProduct(component.order);
    });
    

    it('exist products Information', () => {
      expect(component.order).not.toBeNull();
    });

    it('detail name product', () => {
      const detailproduct = fixture.debugElement.query(By.css('#detailName'));
      expect(detailproduct).toBeTruthy();
      const detailproductNative = detailproduct.nativeElement;
      detailproductNative.innerHTML = 'Videojuego Grand Theft Auto V PS4';
      fixture.detectChanges();
      expect(component.order.detailName).not.toBeNull();
    });

    it('ean product', () => {
      const ean = fixture.debugElement.query(By.css('#ean'));
      expect(ean).toBeTruthy();
      const eanNative = ean.nativeElement;
      eanNative.innerHTML = 'MP02080000000035';
      fixture.detectChanges();
      expect(component.order.ean).not.toBeNull();
    });

    it('quantity product', () => {
      const quantity = fixture.debugElement.query(By.css('#quantity'));
      expect(quantity).toBeTruthy();
      const quantityNative = quantity.nativeElement;
      quantityNative.innerHTML = '1';
      fixture.detectChanges();
      expect(component.order.quantity).not.toBeNull();
    });

    it('totalShippingCost product', () => {
      const totalShippingCost = fixture.debugElement.query(By.css('#totalShippingCost'));
      expect(totalShippingCost).toBeTruthy();
      const totalShippingCostNative = totalShippingCost.nativeElement;
      totalShippingCostNative.innerHTML = '2731';
      fixture.detectChanges();
      expect(component.order.totalShippingCost).not.toBeNull();
    });

    it('price product', () => {
      const price = fixture.debugElement.query(By.css('#price'));
      expect(price).toBeTruthy();
      const priceNative = price.nativeElement;
      priceNative.innerHTML = '104900';
      fixture.detectChanges();
      expect(component.order.price).not.toBeNull();
    });

  });

  describe('Without orders', () => {
    beforeEach(() => {
      component.order = [{
        detailName: '',
        ean: '',
        quantity: '',
        totalShippingCost: '',
        price: ''
      }];
    })

    it('exist products Information', () => {
      expect(component.order).not.toBeNull();
    });

    it('detail name product', () => {
      const detailproduct = fixture.debugElement.query(By.css('#detailName'));
      expect(detailproduct).toBeTruthy();
      const detailproductNative = detailproduct.nativeElement;
      detailproductNative.innerHTML = '';
      fixture.detectChanges();
      expect(component.order.detailName).toBeUndefined();
    });

    it('ean product', () => {
      const ean = fixture.debugElement.query(By.css('#ean'));
      expect(ean).toBeTruthy();
      const eanNative = ean.nativeElement;
      eanNative.innerHTML = '';
      fixture.detectChanges();
      expect(component.order.ean).toBeUndefined();
    });

    it('quantity product', () => {
      const quantity = fixture.debugElement.query(By.css('#quantity'));
      expect(quantity).toBeTruthy();
      const quantityNative = quantity.nativeElement;
      quantityNative.innerHTML = '';
      fixture.detectChanges();
      expect(component.order.quantity).toBeUndefined();
    });

    it('totalShippingCost product', () => {
      const totalShippingCost = fixture.debugElement.query(By.css('#totalShippingCost'));
      expect(totalShippingCost).toBeTruthy();
      const totalShippingCostNative = totalShippingCost.nativeElement;
      totalShippingCostNative.innerHTML = '';
      fixture.detectChanges();
      expect(component.order.totalShippingCost).toBeUndefined();
    });

    it('price product', () => {
      const price = fixture.debugElement.query(By.css('#price'));
      expect(price).toBeTruthy();
      const priceNative = price.nativeElement;
      priceNative.innerHTML = '';
      fixture.detectChanges();
      expect(component.order.price).toBeUndefined();
    });

  });

});

