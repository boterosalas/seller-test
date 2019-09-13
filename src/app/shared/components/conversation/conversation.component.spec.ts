import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationComponent } from './conversation.component';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ItemConversationDirective } from './item-conversation.directive';

@Component({
  template: `
    <app-conversation>
      <div id="itemConversation" *itemConversation>
        ItemConversation
      </div>
      <div id="itemConversation" *itemConversation>
        ItemConversation
      </div>
      <div id="itemConversation" *itemConversation>
        ItemConversation
      </div>
    </app-conversation>
  `
})
class TestConversationComponent {}

describe('ConversationComponent testing', () => {
  let component: TestConversationComponent;
  let fixture: ComponentFixture<TestConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestConversationComponent,
        ConversationComponent,
        ItemConversationDirective
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    const container = fixture.debugElement.children[0].componentInstance;
    const children = fixture.debugElement.children[0].queryAll(
      By.css('#itemConversation')
    );

    expect(children.length).toEqual(3);
    expect(container).toBeTruthy();
  });
});
