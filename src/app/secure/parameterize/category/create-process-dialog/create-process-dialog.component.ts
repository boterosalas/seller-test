import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CategoryTreeService } from '../category-tree.service';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { timer, BehaviorSubject, Observable, Subject, interval } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-create-process-dialog',
  templateUrl: './create-process-dialog.component.html',
  styleUrls: ['./create-process-dialog.component.html.scss']
})
export class CreateProcessDialogComponent implements AfterViewInit {

  inProcess = true;
  componentAlive$ = new Subject<any>();
  Success = false;

  constructor(public dialogRef: MatDialogRef<CreateProcessDialogComponent>,
    public categoryService: CategoryTreeService) {
  }

  ngAfterViewInit() {
    const getStatus$ = this.categoryService.verifyStatusOfCreateCategory();
    timer(500, 5000).pipe(takeUntil(this.componentAlive$), switchMap((val) => getStatus$)).subscribe((res) => {
      try {
        const response = JSON.parse(res.body.body).Data;
        const { Status } = response;
        if (Status === 2) {
          this.Success = true;
          this.inProcess = false;
          this.componentAlive$.next();
        } else if (Status === 3) {
          this.Success = false;
          this.inProcess = false;
          this.componentAlive$.next();
        }
      } catch {
        this.Success = false;
        this.inProcess = false;
        this.componentAlive$.next();
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
