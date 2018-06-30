/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { SendOrderComponent } from './send-order.component';
import { OrdersModule } from '../orders.module';


describe('SendOrderComponent', () => {
  let component: SendOrderComponent;
  let fixture: ComponentFixture<SendOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrdersModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
