/* 3rd party components */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';

/* our own custom components */
import {MaterialModule} from '../../../components/material-components';
import {SearchOrderMenuModule} from '../search-order-menu.module';
import {SearchPendingDevolutionFormComponent} from './search-pending-devolution-form.component';

describe('SearchPendingDevolutionFormComponent', () => {
  let component: SearchPendingDevolutionFormComponent;
  let fixture: ComponentFixture<SearchPendingDevolutionFormComponent>;

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
    fixture = TestBed.createComponent(SearchPendingDevolutionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
