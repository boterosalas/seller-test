import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';

import { SearchEnviosExitoFormComponent } from './search-envios-exito-form.component';
import { SearchOrderMenuModule } from '../search-order-menu.module';

/*
describe('SearchEnviosExitoFormComponent', () => {
  let component: SearchEnviosExitoFormComponent;
  let fixture: ComponentFixture<SearchEnviosExitoFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SharedModule,
        SearchOrderMenuModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchEnviosExitoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/
