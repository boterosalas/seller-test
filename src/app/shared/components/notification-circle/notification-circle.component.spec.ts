import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCircleComponent } from './notification-circle.component';

fdescribe('NotificationCircleComponent', () => {
  let component: NotificationCircleComponent;
  let fixture: ComponentFixture<NotificationCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationCircleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationCircleComponent);
    component = fixture.componentInstance;
    component.value = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('#notification-value').innerText
    ).toEqual('1');
  });

  it('When notifications value is zero', () => {
    component.value = 0;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.notification-circle')).toEqual(
      null
    );
  });
});
