import { Component, OnInit, AfterViewInit, OnDestroy, TemplateRef, Inject } from '@angular/core';
import { CategoryTreeService } from '../../../secure/parameterize/category/category-tree.service';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { timer, BehaviorSubject, Observable, Subject, interval } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface DataProcessDialog {
  successText: string;
  failText: string;
  processText: string;
  initTime: number;
  intervalTime: number;
}

@Component({
  selector: 'app-create-process-dialog',
  templateUrl: './create-process-dialog.component.html',
  styleUrls: ['./create-process-dialog.component.scss']
})
export class CreateProcessDialogComponent implements AfterViewInit, OnDestroy {

  inProcess = true;
  processFinish$ = new Subject<any>();
  Success = false;

  request: Observable<any>;
  content: TemplateRef<any>;

  constructor(public dialogRef: MatDialogRef<CreateProcessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataProcessDialog) {
  }

  ngAfterViewInit() {
    !!this.request && timer(this.data.initTime, this.data.intervalTime).pipe(takeUntil(this.processFinish$), switchMap(() => this.request)).subscribe((res) => {
      try {
        const response = JSON.parse(res.body.body).Data;
        const { Status } = response;
        if (Status === 2) {
          this.Success = true;
          this.inProcess = false;
          this.processFinish$.next(response);
        } else if (Status === 3) {
          this.Success = false;
          this.inProcess = false;
          this.processFinish$.next(response);
        }
      } catch {
        this.Success = false;
        this.inProcess = false;
        this.processFinish$.next(null);
      }
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.processFinish$.next(null);
  }
}
