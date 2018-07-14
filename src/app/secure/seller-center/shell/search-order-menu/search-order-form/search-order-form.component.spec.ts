/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { SearchOrderFormComponent } from './search-order-form.component';
import { MaterialModule } from '../../../components/material-components';
import { SearchOrderMenuModule } from '../search-order-menu.module';

describe('SearchOrderFormComponent', () => {
  let component: SearchOrderFormComponent;
  let fixture: ComponentFixture<SearchOrderFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SearchOrderMenuModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
