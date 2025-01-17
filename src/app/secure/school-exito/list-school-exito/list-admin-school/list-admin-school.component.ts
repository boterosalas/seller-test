import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  CdkDragMove,
  moveItemInArray,
  CdkDragDrop,
} from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import { SchoolExitoService } from '../../school-exito.service';
import { CreateSubmoduleComponent } from '../components/create-submodule/create-submodule.component';
import { DeleteItemModuleComponent } from '../components/delete-item-module/delete-item-module.component';
import { DeleteModuleComponent } from '../components/delete-module/delete-module.component';
import { EditItemModuleComponent } from '../components/edit-item-module/edit-item-module.component';
import { EditModuleComponent } from '../components/edit-module/edit-module.component';
import { MatDialog } from '@angular/material';
import { CreateModuleComponent } from '../components/create-module/create-module.component';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-list-admin-school',
  templateUrl: './list-admin-school.component.html',
  styleUrls: ['./list-admin-school.component.scss'],
})
export class ListAdminSchoolComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropListGroup, { static: false })
  listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, { static: false }) placeholder: CdkDropList;

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;
  public modules = [];
  public disabled = false;
  public emptyData = true;
  public load = true;

  constructor(
    private viewportRuler: ViewportRuler,
    private schoolExitoService: SchoolExitoService,
    public dialog: MatDialog,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
  ) {
    this.target = null;
    this.source = null;
  }

  ngOnInit() {
    this.getAllModules();
  }
  /**
   * funcion para mostrar el modal de creacion de modulo
   *
   * @memberof ListAdminSchoolComponent
   */
  createModule() {
    const dialog = this.dialog.open(CreateModuleComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
    const dialogIntance = dialog.componentInstance;
    dialogIntance.processFinish$.subscribe((val) => {
      this.getAllModules();
    });
  }
  /**
   * funcion para mostrar submodulos y crearlos
   *
   * @param {*} module
   * @param {*} item
   * @memberof ListAdminSchoolComponent
   */
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
  /**
   * funcion para borrar modulo
   *
   * @param {*} module
   * @param {*} item
   * @memberof ListAdminSchoolComponent
   */
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
  /**
   * funcion para editar modulos
   *
   * @param {*} item
   * @memberof ListAdminSchoolComponent
   */
  editFaq(item: any) {
    this.dialog.open(EditModuleComponent, {
      data: item,
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
  /**
   * funcion para eliminar modulos
   *
   * @param {*} item
   * @memberof ListAdminSchoolComponent
   */
  deleteFaq(item: any) {
    this.dialog.open(DeleteModuleComponent, {
      data: item,
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });
  }
  /**
   * funcion para editar item del submodulo
   *
   * @param {*} module
   * @param {*} item
   * @memberof ListAdminSchoolComponent
   */
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

    this.listGroup._items.forEach((dropList) => {
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
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;
    const oldIndex = this.modules[this.sourceIndex].Index;
    let newIndex = 0;

    if (this.sourceIndex > this.targetIndex) {
      newIndex = this.targetIndex > 0 ? this.modules[this.targetIndex - 1].Index : 0;
    } else {
      newIndex = this.targetIndex > 0 ? this.modules[this.targetIndex].Index : 0;
    }
    const params = {
      OldIndex: oldIndex,
      NewIndex: newIndex
    };

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(this.modules, this.sourceIndex, this.targetIndex);
      this.schoolExitoService.updatePositionModules(params).subscribe((result) => {
        if (result && result.statusCode === 200) {
          const { body } = result;
          this.modules = [];
          this.modules = JSON.parse(body).Data;
        }
      });
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

    const dragIndex = __indexOf(
      dropElement.parentElement.children,
      this.source ? phElement : sourceElement
    );
    const dropIndex = __indexOf(
      dropElement.parentElement.children,
      dropElement
    );

    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = sourceElement.clientWidth + 'px';
      phElement.style.height = sourceElement.clientHeight + 'px';

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;
    phElement.style.display = '';
    dropElement.parentElement.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    this.placeholder.enter(
      drag,
      drag.element.nativeElement.offsetLeft,
      drag.element.nativeElement.offsetTop
    );
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
    const point = __isTouchEvent(event)
      ? event.touches[0] || event.changedTouches[0]
      : event;
    const scrollPosition = this.viewportRuler.getViewportScrollPosition();

    return {
      x: point.pageX - scrollPosition.left,
      y: point.pageY - scrollPosition.top,
    };
  }
  /**
   * funcion para capturar los modulos
   *
   * @memberof ListAdminSchoolComponent
   */
  getAllModules() {
    this.schoolExitoService
      .getAllModuleSchoolExito(null)
      .subscribe((result) => {
        if (result && result.statusCode === 200) {
          const { body } = result;
          this.modules = JSON.parse(body).Data;
          if (!this.modules.length) {
            this.emptyData = false;
          }
        } else {
          this.componentsService.openSnackBar(this.languageService.instant('core.http.error_handler.error_acces'), this.languageService.instant('actions.close'), 5000);
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
  drop(
    event: CdkDragDrop<string[]>,
    submodules: any,
    module: any,
    index: number
  ) {
    const oldIndex = this.modules[index].Submodules[event.previousIndex].Index;
    let newIndex = 0;
    this.disabled = true;

    if (event.previousIndex > event.currentIndex) {
      newIndex =
        event.currentIndex > 0
          ? this.modules[index].Submodules[event.currentIndex - 1].Index
          : 0;
    } else {
      newIndex =
        event.currentIndex > 0
          ? this.modules[index].Submodules[event.currentIndex].Index
          : 0;
    }

    const params = {
      ModuleName: module.ModuleName,
      OldIndex: oldIndex,
      NewIndex: newIndex,
    };

    moveItemInArray(submodules, event.previousIndex, event.currentIndex);
    if(oldIndex !== newIndex) {
      this.schoolExitoService.updatePositionSubModules(params).subscribe(
        (result) => {
          if (result && result.statusCode === 200) {
            const { body } = result;
            this.modules[index].Submodules = JSON.parse(body).Data;
            this.disabled = false;
          } 
        },
        (error) => {
          this.componentsService.openSnackBar(this.languageService.instant('core.http.error_handler.error_acces'), this.languageService.instant('actions.close'), 5000);
        }
      );
    }
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
function __isInsideDropListClientRect(
  dropList: CdkDropList,
  x: number,
  y: number
) {
  const {
    top,
    bottom,
    left,
    right,
  } = dropList.element.nativeElement.getBoundingClientRect();
  return y >= top && y <= bottom && x >= left && x <= right;
}
