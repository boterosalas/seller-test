import { Component, OnInit } from '@angular/core';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { SchoolExitoService } from '../../school-exito.service';

@Component({
  selector: 'app-list-seller-school',
  templateUrl: './list-seller-school.component.html',
  styleUrls: ['./list-seller-school.component.scss']
})
export class ListSellerSchoolComponent implements OnInit {

  public modules: Array<number> = [];
  public emptyData = true;
  public load = true;

  constructor(
    private schoolExitoService: SchoolExitoService,
    public componentsService: ComponentsService,
    private languageService: TranslateService,
  ) { }

  ngOnInit() {
    this.getAllModules();
  }
  /**
   * funcion para capturar todos los modulos registrados 
   *
   * @memberof ListSellerSchoolComponent
   */
  getAllModules() {
    this.schoolExitoService.getAllModuleSchoolExito(null).subscribe(result => {
      if (result && result.statusCode === 200) {
        const { body } = result;
        this.modules = JSON.parse(body).Data;
        if (this.modules && this.modules.length > 0) {
          this.emptyData = false;
          this.load = false;
        } else {
          this.emptyData = true;
          this.load = true;
        }
      } else {
        this.componentsService.openSnackBar(this.languageService.instant('core.http.error_handler.error_acces'), this.languageService.instant('actions.close'), 5000);
      }
    });
  }
  /**
   * funcion para descargar el archivo correspondiente al submodulo
   *
   * @param {string} urlFile
   * @memberof ListSellerSchoolComponent
   */
  downloadFile(urlFile: string) {
    if (urlFile) {
      window.open(urlFile, '_back');
    } else {
      this.componentsService.openSnackBar(this.languageService.instant('errors_download_file_submodules'), this.languageService.instant('actions.close'), 5000);
    }
  }

}
