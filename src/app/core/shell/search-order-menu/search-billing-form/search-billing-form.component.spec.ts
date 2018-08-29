import { SearchBillingFormComponent } from './search-billing-form.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchOrderMenuModule } from '../search-order-menu.module';
import { RouterTestingModule } from '@angular/router/testing';


describe('SearchBillingFormComponent', () => {
  let component: SearchBillingFormComponent;
  let fixture: ComponentFixture<SearchBillingFormComponent>;

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
    fixture = TestBed.createComponent(SearchBillingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
