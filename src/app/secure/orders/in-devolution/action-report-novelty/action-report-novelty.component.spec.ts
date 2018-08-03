/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { InDevolutionModule } from '../id-devolution.module';
import { ActionReportNoveltyComponent } from './action-report-novelty.component';

describe('ActionReportNoveltyComponent', () => {
  let component: ActionReportNoveltyComponent;
  let fixture: ComponentFixture<ActionReportNoveltyComponent>;

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
    fixture = TestBed.createComponent(ActionReportNoveltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
