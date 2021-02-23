import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  CdkDrag,
  CdkDropList, CdkDropListGroup, CdkDragMove,
  moveItemInArray,
  CdkDragDrop
} from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import { SchoolExitoService } from '../../school-exito.service';
import { CreateSubmoduleComponent } from '../components/create-submodule/create-submodule.component';
import { DeleteItemModuleComponent } from '../components/delete-item-module/delete-item-module.component';
import { DeleteModuleComponent } from '../components/delete-module/delete-module.component';
import { EditItemModuleComponent } from '../components/edit-item-module/edit-item-module.component';
import { EditModuleComponent } from '../components/edit-module/edit-module.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-list-admin-school',
  templateUrl: './list-admin-school.component.html',
  styleUrls: ['./list-admin-school.component.scss']
})
export class ListAdminSchoolComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropListGroup, { static: false }) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, { static: false }) placeholder: CdkDropList;

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  public modules: Array<number> = [];


  constructor(
    private viewportRuler: ViewportRuler,
    private schoolExitoService: SchoolExitoService,
    public dialog: MatDialog
  ) {
    this.target = null;
    this.source = null;
  }

  ngOnInit() {
    this.getAllModules();
  }



  createSubmodule(module: any, item: any) {
    this.dialog.open(CreateSubmoduleComponent, {
      data: {
        module,
        item,
      },
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  deleteItemFaq(module: any, item: any) {
    this.dialog.open(DeleteItemModuleComponent, {
      data: {
        module,
        item,
      },
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  editFaq(item: any) {
    this.dialog.open(EditModuleComponent, {
      data: item,
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  deleteFaq(item: any) {
    this.dialog.open(DeleteModuleComponent, {
      data: item,
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  editItemFaq(module: any, item: any) {
    this.dialog.open(EditItemModuleComponent, {
      data: {
        module,
        item,
      },
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }

  /**
   * funcion para canturar el elemento en el don, ocultarlo y remover los hijos
   *
   * @memberof ListAdminSchoolComponent
   */
  ngAfterViewInit() {
    const phElement = this.placeholder.element.nativeElement;
    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }
  /**
   * funcion para mover los elementos del drag
   *
   * @param {CdkDragMove} e
   * @memberof ListAdminSchoolComponent
   */
  dragMoved(e: CdkDragMove) {
    const point = this.getPointerPositionOnPage(e.event);

    this.listGroup._items.forEach(dropList => {
      if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
        this.activeContainer = dropList;
        return;
      }
    });
  }
  /**
   * funcion para mover los elementos del drog
   *
   * @returns
   * @memberof ListAdminSchoolComponent
   */
  dropListDropped() {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

    this.target = null;
    this.source = null;

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(this.modules, this.sourceIndex, this.targetIndex);
    }
  }
  /**
   * funcion donde se captura los elementos drag y drop para darle su nueva posicion en el arreglo
   *
   * @memberof ListAdminSchoolComponent
   */
  dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    if (drop === this.placeholder) {
      return true;
    }

    if (drop !== this.activeContainer) {
      return false;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    const dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
    const dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    console.log('donde va a quedar......... luego le resto 1 mayor igual 0 (cero null)', dropIndex);
    console.log('no lo necesitas origen ', dragIndex);
    phElement.style.display = '';
    dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex
      ? dropElement.nextSibling : dropElement));

    this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
    return false;
  }

  /**
   * funcion para saber cual es la posicion del elemento en la pagina
   *
   * @param {(MouseEvent | TouchEvent)} event
   * @returns
   * @memberof ListAdminSchoolComponent
   */
  getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
    const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top
    };
  }
  /**
   * funcion para capturar los modulos
   *
   * @memberof ListAdminSchoolComponent
   */
  getAllModules() {
    this.schoolExitoService.getAllModuleSchoolExito(null).subscribe(result => {
      if (result && result.statusCode === 200) {
        const { body } = result;
        this.modules = JSON.parse(body).Data;
        console.log(this.modules);
      } else {
        console.log('error');
      }
    });
  }
  /**
   * funcion para descargar el archivo
   *
   * @param {string} url
   * @memberof ListAdminSchoolComponent
   */
  downloadFile(url: string) {
    window.open(url, '_back');
  }
  /**
   * funcion para mover los submodulos internos del modulo, posicion vertical
   *
   * @param {CdkDragDrop<string[]>} event
   * @param {*} submodules
   * @memberof ListAdminSchoolComponent
   */
  drop(event: CdkDragDrop<string[]>, submodules: any) {
    console.log('donde llega final, luego le restamos 1 mayor igual a cero y es cero null, buscar en array', event.currentIndex);
    moveItemInArray(submodules, event.previousIndex, event.currentIndex);
  }

}
/**
 * funcion para capturar el index
 *
 * @param {*} collection
 * @param {*} node
 * @returns
 */
function __indexOf(collection: any, node: any) {
  return Array.prototype.indexOf.call(collection, node);
}

/**
 * se dispara el evento cuando se toca
 *
 * @param {(MouseEvent | TouchEvent)} event
 * @returns {event is TouchEvent}
 */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}
/**
 * funcion para saber la posicion de la lista en el drag and drop
 *
 * @param {CdkDropList} dropList
 * @param {number} x
 * @param {number} y
 * @returns
 */
function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
  const { top, bottom, left, right } = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right;
}
