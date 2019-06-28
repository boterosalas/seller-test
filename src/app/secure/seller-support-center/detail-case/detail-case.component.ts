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
import { LoadingService, ModalService } from "@app/core";
import { Logger } from "@core/util/logger.service";
import { ResponseCaseDialogComponent } from "@shared/components/response-case-dialog/response-case-dialog.component";
import { MatDialog } from "@angular/material";

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
  options: any;
  filter: boolean;

  public log: Logger;

  headerConfigurations: any;

  case$: Observable<CaseDetail>;

  configDialog = {
    width: "50%",
    height: "fit-content",
    data: { title: "texts" }
  };

  constructor(
    private sellerSupportService: SellerSupportCenterService,
    private route: ActivatedRoute,
    private loadingService?: LoadingService
  ) {
    this.headerConfigurations = this.sellerSupportService.getListHeaderConfiguration();
  }

  ngOnInit(): void {
    this.loadingService.viewSpinner();

    this.toggleFilter(this.filter);
    this.getStatusCase();

    this.case$ = this.sellerSupportService
      .getCase(this.route.snapshot.paramMap.get("idCase"))
      .pipe(map((res: CaseDetailResponse) => res.data));

    this.case$.subscribe(p => {
      console.log(p);
      this.loadingService.closeSpinner();
    });
  }

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;
    this.menuState = stateFilter ? "in" : "out";
  }

  onEmitResponse(caseResponse: any) {
    /* const dialogRef = this.dialog.open(
      ResponseCaseDialogComponent,
      this.configDialog
    );
    dialogRef.afterClosed().subscribe(result => console.log("are Closed")); */
  }
  getStatusCase() {
    this.sellerSupportService.getAllStatusCase().subscribe(
      res => {
        this.options = res.data;
      },
      error => console.log(error)
    );
  }
}
