/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { InDevolutionModule } from '../id-devolution.module';
import { ActionConfirmReceiptComponent } from './action-confirm-receipt.component';


describe('ActionConfirmReceiptComponent', () => {
  let component: ActionConfirmReceiptComponent;
  let fixture: ComponentFixture<ActionConfirmReceiptComponent>;

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
    fixture = TestBed.createComponent(ActionConfirmReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
