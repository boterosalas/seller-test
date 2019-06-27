import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { SellerSupportCenterService } from "../services/seller-support-center.service";
import { ProductsCaseDialogComponent } from "@shared/components/products-case-dialog/products-case-dialog.component";
import { ResponseCaseDialogComponent } from "@shared/components/response-case-dialog/response-case-dialog.component";
import { MatDialog } from "@angular/material";

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
  options: any;
  filter: boolean;
  menuState: string;
  cases: Array<any>;
  listConfiguration: Array<any>;

  totalPages;
  pages;
  pageSize;

  configDialog = {
    width: "50%",
    height: "fit-content",
    data: { title: "texts" }
  };

  constructor(
    public dialog: MatDialog,
    private sellerSupportService: SellerSupportCenterService
  ) {}

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

  getStatusCase() {
    this.sellerSupportService.getAllStatusCase().subscribe(
      res => {
        this.options = res.data;
      },
      error => console.log(error)
    );
  }

  getAllCases(filter?: any) {
    this.sellerSupportService.getAllCase(filter).subscribe(res => {
      const { pageSize, page, totalPages } = res.data;
      this.cases = res.data.cases;
      this.refreshPaginator(totalPages, page, pageSize);
    });
  }

  submitFilter(filterForm) {
    this.getAllCases(filterForm);
  }

  changeSizeCaseList(paginator) {
    console.log("parent", paginator);
  }

  refreshPaginator(total, page, limit) {
    this.totalPages = total;
    this.pageSize = limit;
    this.pages = page;
  }

  onEmitResponse(caseResponse: any) {
    const dialogRef = this.dialog.open(
      ResponseCaseDialogComponent,
      this.configDialog
    );
    dialogRef.afterClosed().subscribe(result => console.log("are Closed"));
  }
}
