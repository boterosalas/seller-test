/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { SupportModalComponent } from './support-modal.component';
import { SupportModule } from './support-modal.module';

describe('SupportModalComponent', () => {
  let component: SupportModalComponent;
  let fixture: ComponentFixture<SupportModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SupportModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
