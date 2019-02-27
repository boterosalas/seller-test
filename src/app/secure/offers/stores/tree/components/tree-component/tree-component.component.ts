import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { EventEmitterStore } from '../../../events/eventEmitter-store.service';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
  commision: any;
  idCategory: any;
  idParent: any;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  filename: string;
  type: any;
  level: number;
  expandable: boolean;
  commission: any;
  idCategory: any;
  idParent: any;
}

/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class FileDatabase {
  dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);

  public objetoBuild = {};
  public objetoBuildExtraData = {};
  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
  }

  initialize(tree: any) {
    if (typeof tree !== 'undefined') {
      const dataObject = JSON.parse(JSON.stringify(tree));
      const realTree = this.createRealTree(dataObject, this.objetoBuild);
      const treeExtraData = this.createTreeExtraData(dataObject, this.objetoBuildExtraData);
      const data = this.buildFileTree(realTree, 0, treeExtraData);
      this.dataChange.next(data);

    }
  }

  /**
   *
   * @param obj
   * @param objetoBuild
   */
  createRealTree(obj: any, objetoBuild: any) {
    const hijos = {};
    if (obj instanceof Object) {
      for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
          if (k === 'IdParent' && obj.IdParent === null) {
            objetoBuild[obj.Name] = {};
          }
          if (k === 'nodes') {
            for (let i = 0; i < obj[k].length; i++) {
              hijos[obj[k][i].Name] = obj[k][i].Name;
              this.createRealTree(obj[k][i], hijos);
            }
            objetoBuild[obj.Name] = hijos;
          }
        }
      }
    }
    return objetoBuild;
  }

  createTreeExtraData(obj: any, objetoBuildExtraData: any) {
    const hijos = {};
    if (obj instanceof Object) {
      for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
          if (k === 'IdParent' && obj.IdParent === null) {
            objetoBuildExtraData[obj.Name] = {};
          }
          if (typeof k !== 'undefined' && k === 'nodes') {
            for (let i = 0; i < obj[k].length; i++) {
              hijos[obj[k][i].Name] = {};
              hijos[obj[k][i].Name]['Comision'] = obj[k][i].commission;
              hijos[obj[k][i].Name]['idCategory'] = obj[k][i].Id;
              hijos[obj[k][i].Name]['IdParent'] = obj[k][i].IdParent;
              this.createTreeExtraData(obj[k][i], hijos);
            }
            objetoBuildExtraData[obj.Name] = hijos;
            objetoBuildExtraData[obj.Name]['Comision'] = obj.commission;
            objetoBuildExtraData[obj.Name]['idCategory'] = obj.Id;
            objetoBuildExtraData[obj.Name]['IdParent'] = obj.IdParent;
          }
        }
      }
    }
    return objetoBuildExtraData;
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(value: any, level: number, extraData?: any): FileNode[] {
    const data: any[] = [];
    // tslint:disable-next-line:forin
    for (const k in value) {
      const v = value[k];
      const e = extraData[k];
      const node = new FileNode();
      node.filename = `${k}`;
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === 'object') {
        node.commision = e.Comision;
        node.idCategory = e.idCategory;
        node.idParent = e.IdParent;
        node.children = this.buildFileTree(v, level + 1, e);
      } else {
        node.type = v;
        node.commision = e.Comision;
        node.idCategory = e.idCategory;
        node.idParent = e.IdParent;
      }
      data.push(node);
    }
    return data;
  }
}

@Component({
  selector: 'app-tree-component',
  templateUrl: './tree-component.component.html',
  styleUrls: ['./tree-component.component.scss'],
  providers: [FileDatabase]
})
export class TreeComponentComponent implements OnInit {

  treeControl: FlatTreeControl<FileFlatNode>;

  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;

  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  @ViewChild('tree') treeElement;
  // arbol
  @Input() arbol: any;
  @Input() updateFunction: boolean;

  @Output() currentTreeOutput = new EventEmitter<any>();

  public current_tree: any;

  tree: MatTree<FileFlatNode>;

  constructor(
    public database: FileDatabase,
    public eventsStore: EventEmitterStore
  ) {
    // Configuración del eventEmitter para saber cuando desplegar todos los nodos del arbol
    this.eventToExpandAllNodes();

    // Configuración inicial para el arbol de angular material
    this.configureTreeComponent(database);
  }

  ngOnInit() {
    this.database.initialize(this.arbol);
  }

  /**
   * Método que se encarga de la configuración base del arbol
   * @memberof TreeComponentComponent
   */
  configureTreeComponent(database) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
    this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      this.current_tree = this.dataSource.data;
      this.currentTreeOutput.emit(JSON.stringify(this.dataSource.data));
    });
  }

  transformer = (node: FileNode, level: number) => {
    const flatNode = new FileFlatNode();
    flatNode.filename = node.filename;
    flatNode.type = node.type;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.commission = node.commision;
    flatNode.idCategory = node.idCategory;
    flatNode.idParent = node.idParent;
    return flatNode;
  }

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> => {
    return observableOf(node.children);
  }

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;


  /**
   * Evento que permite realizar el despliegue de todos los nodes del arbol actual.
   * @memberof TreeComponentComponent
   */
  eventToExpandAllNodes() {
    this.eventsStore.eventExpandAllNodes.subscribe((res: any) => {
      if (res === true) {
        this.treeElement.treeControl.expandAll();
      } else {
        this.treeElement.treeControl.collapseAll();
      }
    });
  }

}
