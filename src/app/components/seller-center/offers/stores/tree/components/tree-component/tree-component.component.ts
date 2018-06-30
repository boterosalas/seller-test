import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit, Input, ViewChild } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTree, MatTreeModule } from '@angular/material/tree';
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
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  filename: string;
  type: any;
  level: number;
  expandable: boolean;
}

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
const TREE_DATA = `
  {
    "Documents": {
      "angular": {
        "src": {
          "core": "ts",
          "compiler": "ts",
          "src2": {
            "core": "ts",
            "compiler": "ts test de texto mas largo"
          }
        }
      },
      "material2": {
        "src": {
          "button": "ts",
          "checkbox": "ts",
          "input": "ts"
        }
      }
    },
    "Downloads": {
        "Tutorial": "html",
        "November": "pdf",
        "October": "pdf"
    },
    "Pictures": {
        "Sun": "png",
        "Woods": "jpg",
        "Photo Booth Library": {
          "Contents": "dir",
          "Pictures": "dir"
        }
    },
    "Applications": {
        "Chrome": "app",
        "Calendar": "app",
        "Webstorm": "app"
    }
}`;

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

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(TREE_DATA);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(value: any, level: number): FileNode[] {
    const data: any[] = [];
    // tslint:disable-next-line:forin
    for (const k in value) {
      const v = value[k];
      const node = new FileNode();
      node.filename = `${k}`;
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === 'object') {
        node.children = this.buildFileTree(v, level + 1);
      } else {
        node.type = v;
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

  tree: MatTree<FileFlatNode>;

  constructor(
    database: FileDatabase,
    public eventsStore: EventEmitterStore
  ) {
    // Configuración del eventEmitter para saber cuando desplegar todos los nodos del arbol
    this.eventToExpandAllNodes();

    // Configuración inicial para el arbol de angular material
    this.configureTreeComponent(database);
  }

  ngOnInit() {
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
    });
  }

  transformer = (node: FileNode, level: number) => {
    const flatNode = new FileFlatNode();
    flatNode.filename = node.filename;
    flatNode.type = node.type;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
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
