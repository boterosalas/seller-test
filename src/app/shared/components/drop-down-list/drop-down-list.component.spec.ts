import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { DropDownListComponent } from './drop-down-list.component';
import { FlexModule, FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FlexSizePipe } from '../../pipes/flex-size.pipe';

describe('DropDownListComponent', () => {
  let component: DropDownListComponent;
  let fixture: ComponentFixture<DropDownListComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropDownListComponent,
        FlexSizePipe
      ],
      imports: [
        FlexLayoutModule,
        TranslateModule.forRoot({})
      ]
    })
      .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(DropDownListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });
});
