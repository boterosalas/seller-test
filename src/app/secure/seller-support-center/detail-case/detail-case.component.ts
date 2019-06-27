import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { SellerSupportCenterService } from "../services/seller-support-center.service";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { CaseDetail } from "../models/case-detail.model";
import { map } from "rxjs/operators";
import { CaseDetailResponse } from "../models/case-detail-response.model";

@Component({
  selector: "app-detail-case",
  templateUrl: "./detail-case.component.html",
  styleUrls: ["./detail-case.component.scss"],
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
export class DetailCaseComponent implements OnInit {
  menuState: string;

  filter: boolean;

  headerConfigurations: any;

  case$: Observable<CaseDetail>;

  constructor(
    private supportService: SellerSupportCenterService,
    private route: ActivatedRoute
  ) {
    this.headerConfigurations = this.supportService.getListHeaderConfiguration();
  }

  ngOnInit(): void {
    this.toggleFilter(this.filter);
    this.case$ = this.supportService
      .getCase(this.route.snapshot.paramMap.get("idCase"))
      .pipe(map((res: CaseDetailResponse) => res.data));

    this.case$.subscribe(p => console.log(p));
  }

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;
    this.menuState = stateFilter ? 'in' : 'out';
  }
}
