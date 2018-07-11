/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { ProductDevolutionModalComponent } from './product-devolution-modal.component';
import { InDevolutionModule } from '../id-devolution.module';


describe('ProductDevolutionModalComponent', () => {
  let component: ProductDevolutionModalComponent;
  let fixture: ComponentFixture<ProductDevolutionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        InDevolutionModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDevolutionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
