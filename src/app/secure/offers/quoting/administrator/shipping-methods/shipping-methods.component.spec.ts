import { async } from '@angular/core/testing';
import { ShippingMethodsComponent } from './shipping-methods.component';
import { ShippingMethodsModel } from './shipping-methods.model';
import { ShippingMethodsService } from './shipping-methods.service';
import { QuotingAdminService } from '../quoting-administrator.service';
import { LoadingService } from '@app/core';
import { Observable, of } from 'rxjs';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@app/material.module';
import { ModalService } from '@app/core';
import { SharedModule } from '@app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('ShippingMethodsComponent', () => {
  let fixture: ComponentFixture<ShippingMethodsComponent>;
  let component: ShippingMethodsComponent;

  const shippingMethodsList = [
    new ShippingMethodsModel('Por Categoria', 'library_books', 0),
    new ShippingMethodsModel('Rango de precio', 'local_offer', 0),
    new ShippingMethodsModel('Rango de peso', 'assignment', 0),
  ];

  const structureJson = {
    statusCode: 200,
    body: JSON.stringify(({ Data: shippingMethodsList }))
  };

  const modalService = <ModalService>{
    showModal(type: string) {
      return null;
    }
  };

  const shippingService = <ShippingMethodsService>{
    getShippingMethods(): Observable<any> {
      return of(structureJson);
    }
  };

  const loadingService = <LoadingService>{
    closeSpinner() {
    },
    viewSpinner() {
    }
  };

  const quotingService = new QuotingAdminService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShippingMethodsComponent],
      providers: [
        { provide: ShippingMethodsService, useValue: shippingService },
        { provide: QuotingAdminService, useValue: quotingService },
        { provide: LoadingService, useValue: loadingService },
        { provide: ModalService, useValue: modalService },
      ], imports: [
        MaterialModule,
        SharedModule,
        HttpClientTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShippingMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create ShippingMethodsComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should get a list with a service mock', () => {
    fixture.detectChanges();
    expect(component.shippingMethodsList[0].Name).toBe(shippingMethodsList[0].Name);
    expect(component.shippingMethodsList[0].Icon).toBe(shippingMethodsList[0].Icon);
    expect(component.shippingMethodsList[0].Id).toBe(shippingMethodsList[0].Id);
    expect(component.shippingMethodsList[1].Name).toBe(shippingMethodsList[1].Name);
    expect(component.shippingMethodsList[1].Icon).toBe(shippingMethodsList[1].Icon);
    expect(component.shippingMethodsList[1].Id).toBe(shippingMethodsList[1].Id);
    expect(component.shippingMethodsList[2].Name).toBe(shippingMethodsList[2].Name);
    expect(component.shippingMethodsList[2].Icon).toBe(shippingMethodsList[2].Icon);
    expect(component.shippingMethodsList[2].Id).toBe(shippingMethodsList[2].Id);
  });

  it('should get a error when try to get shipping list', () => {
    structureJson.statusCode = 200;
    component.getRequiredData();
    component.getRequiredData();
    component.getRequiredData();
    component.getRequiredData();
    structureJson.statusCode = 400;
    component.getRequiredData();

  });
});
