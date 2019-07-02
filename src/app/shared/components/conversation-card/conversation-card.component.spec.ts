import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ConversationCardComponent } from "./conversation-card.component";

describe("HistoryCardComponent", () => {
  let component: ConversationCardComponent;
  let fixture: ComponentFixture<ConversationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
