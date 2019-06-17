import { fakeAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CaseToolbarComponent } from "./case-toolbar.component";

describe("CaseToolbarComponent", () => {
  let component: CaseToolbarComponent;
  let fixture: ComponentFixture<CaseToolbarComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [MatSidenavModule],
      declarations: [CaseToolbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CaseToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should compile", () => {
    expect(component).toBeTruthy();
  });
});
