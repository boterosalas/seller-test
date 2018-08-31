/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { InDevolutionModule } from '@root/src/app/secure/orders/in-devolution/in-devolution.module';
import { InDevolutionComponent } from './in-devolution.component';


describe('InDevolutionComponent', () => {
  let component: InDevolutionComponent;
  let fixture: ComponentFixture<InDevolutionComponent>;

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
    fixture = TestBed.createComponent(InDevolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
