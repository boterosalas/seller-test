import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { PendingProductsService } from "../pending-products.service";

@Component({
  selector: "app-products-pending-modification-modal",
  templateUrl: "./products-pending-modification-modal.component.html",
  styleUrls: ["./products-pending-modification-modal.component.scss"],
})
export class ProductsPendingModificationModalComponent implements OnInit {
  constructor(
    private pendingProductsSvc: PendingProductsService,
    public dialogRef: MatDialogRef<ProductsPendingModificationModalComponent>
  ) {}

  email = new FormControl("", [Validators.email, Validators.required]);
  categories: Array<{ id: string; name: string; selected?: boolean }> = [];
  selectAll: boolean = false;
  showLoading: boolean = false;

  ngOnInit() {
    this.getCategories();
  }

  /**
   * Obtiene las categorias de los productos pendientes por modificar
   */
  getCategories(): void {
    this.pendingProductsSvc
      .getCategoriesToDownloadProductsPendingModification()
      .subscribe((resp) => (this.categories = resp));
  }

  /**
   * Cambia el estado de seleccionadas todas las opciones
   * @param selected
   * @returns
   */
  selectAllOptions(selected: boolean): void {
    this.selectAll = selected;
    if (this.categories == null) {
      return;
    }
    this.categories.map((c) => (c.selected = selected));
    this.valid();
  }

  /**
   * Actualiza el estado de la variable que informa si todas las opciones han sido sleeccioandas o no
   */
  updateAllComplete() {
    this.selectAll =
      this.categories != null && this.categories.every((t) => t.selected);
    this.valid();
  }

  /**
   * Retorna el estado del formulario si es valdio o no
   * @returns boolean con el estaso
   */
  valid(): boolean {
    if (this.email.valid && this.categories.find((c) => c.selected === true)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método para cerrar el modal
   * @memberof FinishUploadProductInformationComponent
   */
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  /**
   * Acciona la llamada al servicio para ser el envio del archivo al correo seleccioando
   */
  sendReport() {
    this.showLoading = true;
    const categories = this.categories.map((c) => c.id).toString();
    const params = {
      email: this.email.value,
      categories: categories,
    };
    this.pendingProductsSvc
      .sendReportProductsPendingModification(params)
      .subscribe((resp) => {
        this.showLoading = false;
        this.onNoClick();
      });
  }
}
