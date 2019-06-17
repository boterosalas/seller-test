
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TicketToolbarComponent } from './ticket-toolbar.component';

describe('TicketToolbarComponent', () => {
  let component: TicketToolbarComponent;
  let fixture: ComponentFixture<TicketToolbarComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [TicketToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
