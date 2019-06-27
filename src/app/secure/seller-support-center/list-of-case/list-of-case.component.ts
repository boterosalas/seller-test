import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { SellerSupportCenterService } from "../services/seller-support-center.service";

@Component({
  selector: "app-list-of-case",
  templateUrl: "./list-of-case.component.html",
  styleUrls: ["./list-of-case.component.scss"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translate3d(0, 0, 0)"
        })
      ),
      state(
        "out",
        style({
          transform: "translate3d(100%, 0, 0)"
        })
      ),
      transition("in => out", animate("400ms ease-in-out")),
      transition("out => in", animate("400ms ease-in-out"))
    ])
  ]
})
export class ListOfCaseComponent implements OnInit {
  filter: boolean;
  menuState: string;
  cases: Array<any>;
  listConfiguration: Array<any>;

  constructor(private sellerSupportService: SellerSupportCenterService) {}

  ngOnInit() {
    this.listConfiguration = this.sellerSupportService.getListHeaderConfiguration();
    this.toggleFilter(this.filter);

    this.sellerSupportService
      .getAllCase({ Page: 1, PageSize: 100 })
      .subscribe(res => {
        console.log(res.data.cases);
        return (this.cases = res.data.cases);
      });
  }

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;
    this.menuState = stateFilter ? "in" : "out";
  }
}
