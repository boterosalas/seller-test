/* 3rd party components */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

/* our own custom components */
import {SearchOrderMenuComponent} from './search-order-menu.component';
import {SearchOrderMenuModule} from './search-order-menu.module';

/*
describe('SearchOrderMenuComponent', () => {
  let component: SearchOrderMenuComponent;
  let fixture: ComponentFixture<SearchOrderMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SearchOrderMenuModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOrderMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });
});*/
