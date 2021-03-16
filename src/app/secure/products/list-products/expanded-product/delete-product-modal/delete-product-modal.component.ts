import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { ListProductService } from '../../list-products.service';

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.scss']
})
export class DeleteProductModalComponent implements OnInit, OnDestroy {
  public showSuccess = false;
  public disabled = false;
  processFinish$ = new Subject<any>();

  constructor(
    public dialogRef: MatDialogRef<DeleteProductModalComponent>,
    public listProductService: ListProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }
/**
 * funcion para cerrar el modal
 *
 * @memberof DeleteProductModalComponent
 */
onNoClick() {
    this.dialogRef.close();
  }
/**
 * funcion para confirmar el la eliminacion del producto
 *
 * @param {*} data
 * @memberof DeleteProductModalComponent
 */
confirmation(data: any) {
  this.disabled = true;
    if (data && data.data && data.data.ean) {
      const ean = data.data.ean;
      this.listProductService.deleteProductByEan(ean).subscribe(result => {
        this.showSuccess = true;
        this.disabled = false;
        this.processFinish$.next({response : true});
      });
    }
  }
/**
 * funcion para destruir el componente cuandos se acaba la session
 *
 * @memberof DeleteProductModalComponent
 */
ngOnDestroy() {
    this.dialogRef.close();
  }

}
