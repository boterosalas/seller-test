import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFraudNotificationFormComponent } from './search-fraud-notification-form.component';

describe('SearchFraudNotificationFormComponent', () => {
  let component: SearchFraudNotificationFormComponent;
  let fixture: ComponentFixture<SearchFraudNotificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchFraudNotificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFraudNotificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
