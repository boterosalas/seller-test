import { AfterViewInit, Component, NgModule, OnInit, ViewChild } from '@angular/core';
import {
  CdkDrag,
  CdkDragStart,
  CdkDropList, CdkDropListGroup, CdkDragMove, CdkDragEnter,
  moveItemInArray,
  CdkDragDrop
} from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import { SchoolExitoService } from '../school-exito.service';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';

@Component({
  selector: 'app-list-school-exito',
  templateUrl: './list-school-exito.component.html',
  styleUrls: ['./list-school-exito.component.scss']
})
export class ListSchoolExitoComponent implements OnInit {
// export class ListSchoolExitoComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkDropListGroup, { static: false }) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList, { static: false }) placeholder: CdkDropList;

  public items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public dragIndex: number;
  public activeContainer;

  public modules: Array<number> = [];




  public isAdmin: boolean;

  constructor(
    private viewportRuler: ViewportRuler,
    private schoolExitoService: SchoolExitoService,
    private profileService: MyProfileService,
  ) {
    this.target = null;
    this.source = null;
  }

  ngOnInit() {
    this.getAllModules();
    this.getAllDataUser();
  }


  async getAllDataUser() {
    const sellerData = await this.profileService.getUser().toPromise().then(res => {
      const body: any = res.body;
      const response = JSON.parse(body.body);
      const userData = response.Data;
      localStorage.setItem('typeProfile', userData.Profile);
      if (userData.Profile !== 'seller' && userData.Profile && userData.Profile !== null) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    });
  }

  // ngAfterViewInit() {
  //   let phElement = this.placeholder.element.nativeElement;
  //   phElement.style.display = 'none';
  //   phElement.parentElement.removeChild(phElement);
  // }

  // dragMoved(e: CdkDragMove) {
  //   let point = this.getPointerPositionOnPage(e.event);

  //   this.listGroup._items.forEach(dropList => {
  //     if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
  //       this.activeContainer = dropList;
  //       return;
  //     }
  //   });
  // }

  // dropListDropped() {
  //   if (!this.target) {
  //     return;
  //   }

  //   let phElement = this.placeholder.element.nativeElement;
  //   let parent = phElement.parentElement;

  //   phElement.style.display = 'none';

  //   parent.removeChild(phElement);
  //   parent.appendChild(phElement);
  //   parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

  //   this.target = null;
  //   this.source = null;

  //   if (this.sourceIndex !== this.targetIndex) {
  //     moveItemInArray(this.modules, this.sourceIndex, this.targetIndex);
  //   }
  // }

  // dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
  //   if (drop === this.placeholder) {
  //     return true;
  //   }

  //   if (drop !== this.activeContainer) {
  //     return false;
  //   }

  //   let phElement = this.placeholder.element.nativeElement;
  //   let sourceElement = drag.dropContainer.element.nativeElement;
  //   let dropElement = drop.element.nativeElement;

  //   let dragIndex = __indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
  //   let dropIndex = __indexOf(dropElement.parentElement.children, dropElement);

  //   if (!this.source) {
  //     this.sourceIndex = dragIndex;
  //     this.source = drag.dropContainer;

  //     phElement.style.width = sourceElement.clientWidth + 'px';
  //     phElement.style.height = sourceElement.clientHeight + 'px';

  //     sourceElement.parentElement.removeChild(sourceElement);
  //   }

  //   this.targetIndex = dropIndex;
  //   this.target = drop;

  //   console.log('donde va a quedar......... luego le resto 1 mayor igual 0 (cero null)', dropIndex);
  //   console.log('no lo necesitas origen ', dragIndex);
  //   phElement.style.display = '';
  //   dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex
  //     ? dropElement.nextSibling : dropElement));

  //   this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
  //   return false;
  // }

  // /** Determines the point of the page that was touched by the user. */
  // getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
  //   // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
  //   const point = __isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
  //   const scrollPosition = this.viewportRuler.getViewportScrollPosition();

  //   return {
  //     x: point.pageX - scrollPosition.left,
  //     y: point.pageY - scrollPosition.top
  //   };
  // }
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

  // downloadFile(url: string) {
  //   window.open(url, '_back');
  // }

  // drop(event: CdkDragDrop<string[]>, submodules: any) {
  //   console.log('donde llega final, luego le restamos 1 mayor igual a cero y es cero null, buscar en array', event.currentIndex);
  //   moveItemInArray(submodules, event.previousIndex, event.currentIndex);
  // }
}

// function __indexOf(collection: any, node: any) {
//   return Array.prototype.indexOf.call(collection, node);
// }

// /** Determines whether an event is a touch event. */
// function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
//   return event.type.startsWith('touch');
// }

// function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
//   const { top, bottom, left, right } = dropList.element.nativeElement.getBoundingClientRect();
//   return y >= top && y <= bottom && x >= left && x <= right;
// }
