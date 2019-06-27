import { Component, ViewChild, OnInit, Input } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/animations";
import { SellerSupportCenterService } from "../services/seller-support-center.service";
import { initServicesIfNeeded } from "@angular/core/src/view";
import { PageEvent } from "@angular/material";

const listConfiguration = require("./configuration-list-component.json");

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

  constructor(private sellerSupportService: SellerSupportCenterService) {


  }

  ngOnInit() {
    this.listConfiguration = listConfiguration;
    this.getStatusCase();
    this.getAllCases({ page: 1, pageSize: 50 , totalPages: 100});
    this.toggleFilter(this.filter);
  }

  toggleFilter(stateFilter: boolean) {
    this.filter = stateFilter;

    this.menuState = stateFilter ? "in" : "out";
  }

  getStatusCase() {
    this.sellerSupportService.getAllStatusCase()
      .subscribe(res =>{
        this.options = res.data;
      },
        error => console.log(error));
  }

  getAllCases(filter?: any) {
    this.sellerSupportService
      .getAllCase(filter)
      .subscribe(res => {
        const { pageSize, page, totalPages } = res.data;
        this.cases = res.data.cases;
        this.refreshPaginator(totalPages, page, pageSize);
      });
  }

  submitFilter(filterForm) {
    this.getAllCases(filterForm);
  }

  changeSizeCaseList(paginator){
    console.log('parent', paginator);
  }

  refreshPaginator(total, page, limit) {
    this.totalPages = total;
    this.pageSize = limit;
    this.pages = page;
  }
}
