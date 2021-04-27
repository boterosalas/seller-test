import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { LoadingService, ModalService } from '@app/core';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { SizesService } from './sizes.service';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  displayedColumns = ['Name', 'State', 'Actions'];

  dataSource: any;


  public paginationToken = '{}';
  public limit = 0;
  titleAgreement: any;
  length = 0;
  public pageSize = 50;

  public arrayPosition = [];
  paramsArray: any;
  pageSizeOptions: number[] = [50, 100, 200];
  pageEvent: PageEvent;
  public callOne = true;
  sizes: any;
  constructor(
    private service: SizesService,
    private loadingService: LoadingService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.listSize();
  }

  listSize(params?: any) {
    this.loadingService.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = params;
    } else {
      urlParams = `?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`;
    }
    console.log(urlParams);
    this.service.getListSizes(urlParams).subscribe(result => {
      console.log(result);
      if (result.status === 200 || result.status === 201) {
        this.dataSource = result.viewModel;
        if (this.callOne) {
          this.length = result.count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.paginationToken = result.PaginationToken;
        this.loadingService.closeSpinner();
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.modalService.showModal('errorService');
    });
  }

}
