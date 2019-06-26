import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-conversation-card",
  templateUrl: "./conversation-card.component.html",
  styleUrls: ["./conversation-card.component.scss"]
})
export class ConversationCardComponent implements OnInit {
  @Input() name: string;

  @Input() message: string;

  @Input() date: string;

  ngOnInit() {}
}
