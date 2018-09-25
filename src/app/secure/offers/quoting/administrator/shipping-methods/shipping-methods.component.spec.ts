import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingMethodsComponent } from './shipping-methods.component';
import { ShippingMethodsModel } from './shipping-methods.model';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ShippingMethodsService } from './shipping-methods.service';
import { MaterialModule } from '@app/material.module';
import { HttpModule } from '@angular/http';
fdescribe('ShippingMethodsComponent', () => {
  let component: ShippingMethodsComponent;

  const shippingMethodsList = [
    new ShippingMethodsModel('Por Categoria', 'library_books', 0),
    new ShippingMethodsModel('Rango de precio', 'local_offer', 0),
    new ShippingMethodsModel('Rango de peso', 'assignment', 0),
  ];
  const shippingService = <ShippingMethodsService>{
    getFakeListShipingMethods() {
      return shippingMethodsList;
    }
  };

  beforeEach(async(() => {
    component = new ShippingMethodsComponent(shippingService);
  }));


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should get a list with methids', () => {
    component.getRequiredData();
    expect(component.shippingMethodsList[0].nameShippingMethod).toBe(shippingMethodsList[0].nameShippingMethod);
  });
});
