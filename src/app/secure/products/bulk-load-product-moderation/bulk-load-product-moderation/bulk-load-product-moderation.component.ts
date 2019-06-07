import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { SendModerationFormatModalComponent } from '@secure/products/bulk-load-product-moderation/send-moderation-format-modal/send-moderation-format-modal.component';
import { ConfigBulkLoad, Event, TypeEvents } from '@shared/components/bulk-load';
import { MenuModel, loadFunctionality, moderateName } from '@app/secure/auth/auth.consts';
import { AuthService } from '@app/secure/auth/auth.routing';
import { LanguageService } from '@app/core/translate/language.service';

@Component({
  selector: 'app-bulk-load-product-moderation',
  templateUrl: './bulk-load-product-moderation.component.html',
  styleUrls: ['./bulk-load-product-moderation.component.scss']
})
export class BulkLoadProductModerationComponent implements OnInit, AfterViewInit {
  // Plantilla para configurar el contenido principal del componente 'bulk-load'.
  @ViewChild('mainContentTpl') private mainContentTpl: TemplateRef<any>;
  // Configuración del componente 'bulk-load'.
  config: Partial<ConfigBulkLoad> = {
    title: 'VALIDACIÓN DE PRODUCTOS'
    // title: this.languageService.getValue('secure.seller.list.product_validation')
  };
  // Referencia de la modal
  dialogRef: MatDialogRef<SendModerationFormatModalComponent>;

   // Variables con los permisos que este componente posee
   permissionComponent: MenuModel;
   load = loadFunctionality;
   disabledLoad = false;

  constructor(private dialog: MatDialog,
    public authService: AuthService,
    private languageService: LanguageService) { }

  ngOnInit() {
     /*Se llama el metodo que valida si se encuentra logeado, este metodo hace un callback y llama el metodo isLoggedIn()*/
     this.permissionComponent = this.authService.getMenu(moderateName);
     this.disabledLoad = !this.getFunctionality(this.load);
  }

  ngAfterViewInit() {
    this.config.mainContentTpl = this.mainContentTpl;
  }

  /**
   * Funcion que verifica si la funcion del modulo posee permisos
   *
   * @param {string} functionality
   * @returns {boolean}
   * @memberof BulkLoadProductModerationComponent
   */
  public getFunctionality(functionality: string): boolean {
    const permission = this.permissionComponent.Functionalities.find(result => functionality === result.NameFunctionality);
    return permission && permission.ShowFunctionality;
  }


  /**
   * Abre una modal y solicita el correo al cual se va enviar la moderación.
   */
  requestMail() {
    this.dialogRef = this.dialog.open(SendModerationFormatModalComponent);
  }

  /**
   * Controla los eventos que ocurren en el componente 'bulk-load'.
   *
   * @param {Event} e
   */
  manageEvents(e: Event) {
    // Descargar formato
    if (e.type === TypeEvents.download) {
      this.requestMail();
    }
  }

}
