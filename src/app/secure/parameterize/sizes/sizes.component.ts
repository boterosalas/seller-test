import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { LoadingService, ModalService } from '@app/core';
import { BasicInformationService } from '@app/secure/products/create-product-unit/basic-information/basic-information.component.service';
import { SupportService } from '@app/secure/support-modal/support.service';
import { SizesService } from './sizes.service';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss']
})
export class SizesComponent implements OnInit {

  displayedColumns = ['Name', 'State', 'Actions'];

  // dataSource: any;


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

  dataSource: MatTableDataSource<any>;

  public filterSizes: FormGroup;

  sizeRegex = {
    sizeProduct: ''
  };

  // parametro de filtro
  namefilter: string;


  constructor(
    private service: SizesService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private fb?: FormBuilder,
    public SUPPORT?: SupportService,
  ) { }

  ngOnInit() {
    this.listSize();
    this.validateFormSupport();
  }

  public validateFormSupport(): void {
    this.SUPPORT.getRegexFormSupport(null).subscribe(res => {
      let dataRegexs = JSON.parse(res.body.body);
      dataRegexs = dataRegexs.Data.filter(data => data.Module === 'productos');
      for (const val in this.sizeRegex) {
        if (!!val) {
          const element = dataRegexs.find(regex => regex.Identifier === val.toString());
          this.sizeRegex[val] = element && `${element.Value}`;
        }
      }
      this.createFormControls();
    });
  }

  createFormControls() {
    this.filterSizes = this.fb.group({
      SizeName: new FormControl('', [Validators.pattern(this.sizeRegex.sizeProduct)]),
    });
  }

  listSize(params?: any, filters?: any) {
    this.loadingService.viewSpinner();
    let urlParams;
    if (params) {
      urlParams = params;
      console.log('if')
    } else {
      urlParams = `?limit=${this.pageSize}&paginationToken=${encodeURI(this.paginationToken)}`;
    }
    if (filters) {
      urlParams = `?name=${filters}&limit=${this.limit}&paginationToken=` + this.paginationToken;
    }
    console.log(urlParams);
    this.service.getListSizes(urlParams).subscribe(result => {
      console.log(result);
      if (result) {
        this.dataSource = result.viewModel;
        console.log(this.dataSource);
        if (this.callOne) {
          this.length = result.count;
          this.arrayPosition = [];
          this.arrayPosition.push('{}');
          this.callOne = false;
        }
        this.paginationToken = result.paginationToken;
        this.loadingService.closeSpinner();
      }
    }, error => {
      this.loadingService.closeSpinner();
      this.modalService.showModal('errorService');
    });
  }

  /**
   * Evento para manejar la paginación
   * @param {*} event
   * @returns {*}
   * @memberof SizesComponent
   */
  paginations(event: any): any {
    console.log(event);
    if (event.pageSize !== this.limit) {
      this.limit = event.pageSize;
    }
    if (event && event.pageIndex >= 0) {
      console.log('entra aki');
      const index = event.pageIndex;
      if (index === 0) {
        this.paginationToken = encodeURI('{}');
      }
      const isExistInitial = this.arrayPosition.includes('{}');
      if (isExistInitial === false) {
        this.arrayPosition.push('{}');
      }
      const isExist = this.arrayPosition.includes(this.paginationToken);
      if (isExist === false) {
        this.arrayPosition.push(this.paginationToken);
      }
      this.paginationToken = this.arrayPosition[index];
      if (this.paginationToken === undefined) {
        this.paginationToken = encodeURI('{}');
      }
      this.paramsArray = 'limit=' + this.limit + '&paginationToken=' + this.paginationToken;
      this.listSize(this.paramsArray);
    }
  }

  /**
   * Funcion para aplicar filtros y permanecer paginacion y limite
   * @memberof SizesComponent
   */
  public filterApply() {
    this.callOne = true;
    this.paginationToken = encodeURI('{}');
    this.namefilter = encodeURIComponent(this.filterSizes.controls.SizeName.value);
    this.listSize(null, this.namefilter.toUpperCase());
  }

  /**
   * Limpiar filtros
   * @memberof SizesComponent
   */
  public cleanFilter() {
    this.filterSizes.reset();
    this.listSize();
  }

}
