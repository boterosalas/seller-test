/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

/* our own custom components */
import { SearchEnviosExitoFormComponent } from './search-envios-exito-form.component';
import { SearchOrderMenuModule } from '../search-order-menu.module';
import { MaterialModule } from '../../../components/material-components';


describe('SearchEnviosExitoFormComponent', () => {
  let component: SearchEnviosExitoFormComponent;
  let fixture: ComponentFixture<SearchEnviosExitoFormComponent>;

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
    fixture = TestBed.createComponent(SearchEnviosExitoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
