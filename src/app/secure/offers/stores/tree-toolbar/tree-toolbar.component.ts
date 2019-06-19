import { Component, Input, OnInit } from '@angular/core';
import { Logger } from '@app/core/util';
import { ShellComponent } from '@app/core/shell';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { EventEmitterStore } from '../events/eventEmitter-store.service';
import { IsLoadInformationForTree } from '../models/store.model';
import { StoresService } from '../stores.service';
import { LoadingService } from '@app/core';


const EXCEL_EXTENSION = '.xlsx';
const log = new Logger('TreeToolbarComponent');

@Component({
  selector: 'app-tree-toolbar',
  templateUrl: './tree-toolbar.component.html',
  styleUrls: ['./tree-toolbar.component.scss']
})
export class TreeToolbarComponent implements OnInit {
  public objetoBuild: any;
  public route = [];
  public rutaPadre = '';
  public searchStore: any;

  @Input() currentTree;

  constructor(
    public eventsStore: EventEmitterStore,
    public storesService: StoresService,
    public shell: ShellComponent,
    private loadingService: LoadingService) { }


  // variable empleada para saber si se obtuvo la información necesaria para el arbol correctamente
  informationForTreeIsLoad = false;

  ngOnInit() {

    // EventEmitter que permite saber cuando el usuario a buscado una tienda y se ha cargado la información de su comision
    this.eventsStore.eventInformationForTreeIsLoad.subscribe((res: IsLoadInformationForTree) => {
      // capturo el boolean que indica si se cargo o no la información
      console.log('eventInformation', res);
      this.informationForTreeIsLoad = res.informationForTreeIsLoad;
    });
  }

  /**
   * Método empleado para expandir o colapsar los nodos del arbol de categorías
   * Se emplea un event que permite notificar a quien este suscrito que el usuario ha indicado expandir o colapsar los nodos
   * @param {boolean} state
   * @memberof TreeToolbarComponent
   */
  expandAllNodes(state: boolean) {
    // llamo el eventEmitter que se emplea para notificar cuando una tienda ha sido consultada
    this.eventsStore.expandAllNodes(state);
  }

  modifyCommission() {
    console.log('si edito');
    this.loadingService.viewSpinner();
    const params = localStorage.getItem('parametersCommission');
    this.storesService.patchSellerCommissionCategory(params).subscribe((res: any) => {
      if (res.status === 200) {
        this.loadingService.closeSpinner();
        console.log('ahora que hago');
        this.searchStore = JSON.parse(localStorage.getItem('searchStore'));
      } else {
        this.loadingService.closeSpinner();
        log.error(res.message);
      }
    });
  }

  saveTreeToExcel() {
    const current_tree = JSON.parse(this.currentTree);
    this.objetoBuild = [];
    this.currentDownloadTree(current_tree[0], this.rutaPadre);
    this.exportAsExcelFile(this.objetoBuild, 'arbol_categorias_');
  }


  public currentDownloadTree(root: any, rutaPadre: any) {
    const ruta = rutaPadre === '' ? root.filename : rutaPadre + '|' + root.filename;
    this.objetoBuild.push({ ruta: ruta, comision: root.commision });
    if (root.children !== undefined) {
      for (let i = 0; i < root.children.length; i++) {
        this.currentDownloadTree(root.children[i], ruta);
      }
    }
  }

  buildJSONExcelExport(obj: any, objetoBuild: any, route: any) {
    let hijos = {};
    let route_string = '';

    for (let i = 0; i < obj.length; i++) {
      if (obj[i].children === null || obj[i].children === undefined) {
        route.push(obj[i].filename);
        route_string = route.toString().replace(/,/g, '|');
        hijos = { 'ruta': route_string, 'comision': obj[i].commision };
        objetoBuild.push(hijos);
      } else if (typeof obj[i].children === 'object') {
        route.push(obj[i].filename);
        route_string = route.toString().replace(/,/g, '|');
        hijos = { 'ruta': route_string, 'comision': obj[i].commision };
        objetoBuild.push(hijos);
        objetoBuild = this.buildJSONExcelExport(obj[i].children, objetoBuild, route);
      }
    }
    return objetoBuild;
  }
  /**
   * Método que genera el dato json en el formato que emplea excel para.
   * @param {any[]} json
   * @param {string} excelFileName
   * @memberof FinishUploadInformationComponent
   */
  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', bookSST: false, type: 'binary' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
    this.loadingService.closeSpinner();
  }
  /**
   * Método que permite generar el excel con los datos pasados.
   * @param {*} buffer
   * @param {string} fileName
   * @memberof FinishUploadInformationComponent
   */
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([this.s2ab(buffer)], {
      type: ''
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  /**
   * Método que permite dar el formato correcto al archivo excel generado
   * @param {*} s
   * @returns
   * @memberof FinishUploadInformationComponent
   */
  s2ab(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    // tslint:disable-next-line:curly
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
}
