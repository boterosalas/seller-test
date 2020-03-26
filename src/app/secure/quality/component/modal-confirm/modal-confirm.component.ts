import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '@app/shared';
import { HttpEvent, HttpClient } from '@angular/common/http';
import { CalificationService } from '../../quality.service';
import { Subject } from 'rxjs';
import { LoadingService } from '@app/core';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {
  public params: any;

  @Output() deleteConfirm = new EventEmitter<any>();
  processFinish$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: CommonService,
    private calificationService: CalificationService,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
  }

  confirmDelete(data: any) {
    this.params = {
      IdSeller : data.idSeller,
      IdToProcess : data.idToProcess,
      Sku : data.ean,
      QualificationDate: data.qualificationDate,
      TypeExclusion : data.typeExclusion,
    };
    this.calificationService.delete(this.params).subscribe((res: any) => {
      this.loadingService.viewSpinner();
      if (res) {
        this.processFinish$.next(res);
      }
    });
  }

  closeAll() {
    this.dialogRef.close();
  }

}
