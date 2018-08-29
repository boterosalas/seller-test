/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { ViewCommentComponent } from './view-comment.component';
import { InValidationModule } from '../in-validation.module';

describe('ViewCommentComponent', () => {
  let component: ViewCommentComponent;
  let fixture: ComponentFixture<ViewCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        InValidationModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
