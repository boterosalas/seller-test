import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { SharedModule } from '../../../shared/shared.module';

import { LoadingComponent } from './loading.component';


describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      declarations: [LoadingComponent]
    })
      .compileComponents();
  }));

  beforeEach(fakeAsync (() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
