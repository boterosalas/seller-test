import { Component, Inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar,
} from '@angular/material';
import { SchoolExitoService } from '@app/secure/school-exito/school-exito.service';
import { ComponentsService } from '@app/shared';
import { TranslateService } from '@ngx-translate/core';
import { EditModuleComponent } from '../edit-module/edit-module.component';
import { Router } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LoadingService } from '@app/core';

@Component({
  selector: 'app-create-module',
  templateUrl: './create-module.component.html',
  styleUrls: ['./create-module.component.scss'],
})
export class CreateModuleComponent implements OnInit {
  createModule: FormGroup;
  manualEsp: string;
  manualIng: string;
  oneEspFile: boolean = true;
  module = [];
  itemModule: any;
  visible = true;
  selectable = true;
  removable = true;
  activeSave: boolean = true;
  activeAddSubmodule: boolean = true;
  filesEsp = [];
  filesIng = [];
  moduleName: string;
  request: Observable<any>;
  processFinish$ = new Subject<any>();
  showSuccess = false;
  showError = false;
  submoduleNames = [];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditModuleComponent>,
    public snackBar: MatSnackBar,
    private loadingService: LoadingService,
    public _schoolExito: SchoolExitoService,
    public componentService: ComponentsService, // private languageService: TranslateService, // private router: Router
    private languageService: TranslateService,
    private router: Router,
  ) { }

  /**
   * 
   * @param submodule
   * Recibe el submodulo y elimina el seleccionado
   */

  remove(submodule: any): void {
    this.itemModule = this.module.forEach((submoduleFilter) =>
      submoduleFilter.SubModules.filter((sub: any) => {
        if (sub.SubModuleName === submodule.SubModuleName) {
          const index = submoduleFilter.SubModules.indexOf(sub);
          submoduleFilter.SubModules.splice(index, 1);
        }
      })
    );
    this.itemModule = this.module;
    if (this.itemModule[0].SubModules.length === 0) {
      this.activeSave = true;
    }
  }

  /**
   * Formulario de creacion del modulo
   */

  public createFormModule() {
    this.createModule = this.fb.group({
      moduleName: new FormControl('', Validators.required),
      subModuleName: new FormControl(''),
    });
  }

  ngOnInit() {
    this.createFormModule();
  }

  /**
   * Cierra la modal
   */

  public close(): void {
    this.dialogRef.close();
  }

  /**
   *
   * @param param0 recibe la data del archivo b64 en español
   */

  public addFileEsp({ data }) {
    if (data !== '') {
      this.manualEsp = data;
      this.oneEspFile = false;
    }
  }

  public addFileIng({ data }) {
    if (data !== '') {
      this.manualIng = data;
    }
  }

  /**
   * 
   * @param value recibe un booleano que por lo menos este el archivo en español
   */

  public onefileEsp(value: any) {
    setTimeout(() => {
      this.oneEspFile = value;
    });
  }

  /**
   * Funcion que añade el submodulo al arreglo
   */

  public addSubmodule() {
    this.moduleName = this.createModule.controls.moduleName.value;
    const subModuleName = this.createModule.controls.subModuleName.value;

    if (this.module.length) {
      this.activeSave = false;
    }

    let fileEsp = {
      Pdf: this.manualEsp,
      Language: 'es-CO',
    };

    let fileIng = {
      Pdf: this.manualIng,
      Language: 'en-US',
    };

    if (this.manualEsp === undefined) {
      fileEsp = {
        Pdf: '',
        Language: 'es-CO',
      };
    }

    if (this.manualIng === undefined) {
      fileIng = {
        Pdf: '',
        Language: '',
      };
    }

    const data = {
      Modulename: this.moduleName,
      SubModules: [
        {
          SubModuleName: subModuleName,
          Files: [fileEsp, fileIng],
        },
      ],
    };

    if (this.module.length === 0) {
      this.module.push(data);
    } else {
      this.module[0].SubModules.push(...data.SubModules);
    }

    this.createModule.controls.subModuleName.reset('');
    this.activeAddSubmodule = true;
    this.filesEsp = [];
    this.filesIng = [];
  }


  /**
   * detecta cambios en los formularios para activar el boton del submodulo
   */

  public changeValue() {
    this.createModule.valueChanges.subscribe(
      ({ subModuleName, moduleName }) => {
        if (subModuleName !== '' && moduleName !== '') {
          this.activeAddSubmodule = false;
        } else {
          this.activeAddSubmodule = true;
        }
      }
    );
  }

  /**
   * detecta cambios en los formularios para activar el boton de guardado
   */

  public changeValueModuleName() {
    this.createModule.valueChanges.subscribe(
      ({ subModuleName, moduleName }) => {

        if (subModuleName === '') {
          this.activeAddSubmodule = true;
          this.activeSave = true;
        }
        if (this.module.length > 0 && moduleName !== '' && subModuleName === '') {
          this.activeSave = false;
        }
        if (this.module.length === 0 && moduleName !== '' && subModuleName === '') {
          this.activeSave = true;
        }
      }
    );
  }

  /**
   * llama al servicio de crear el modulo
   */

  public createModules() {
    this.loadingService.viewSpinner();
    this.module[0].Modulename = this.createModule.controls.moduleName.value;
    this._schoolExito.createModules(this.module[0]).subscribe((resp: any) => {
      if (resp) {
        if (resp.statusCode === 200) {
          const body = JSON.parse(resp.body);
          if (body && body.Data === true) {
            this.validateLoad();
          }
        }
      } else {
        this.componentService.openSnackBar(
          'error resp',
          this.languageService.instant('actions.close'),
          5000
        );
      }
    });
  }

/**
 * funcion para consultar por un rango de tiempo un endPoint 
 *
 * @memberof CreateModuleComponent
 */
validateLoad() {
    this.request = this._schoolExito.validateCreateMassive();
    // tslint:disable-next-line: no-unused-expression
    !!this.request && timer(500, 6000).pipe(takeUntil(this.processFinish$), switchMap(() => this.request)).subscribe((res) => {
      try {
        const body = JSON.parse(res.body);
        if (body && body.Data) {
          const { Status, Response } = body.Data;
         if (Status === 2) {
          this.loadingService.closeSpinner();
         this.showSuccess = true;
         this.showError = false;
         const dataSubmodules = JSON.parse(Response);
         this.submoduleNames = dataSubmodules.Data;
          this.processFinish$.next(true);
         } else if (Status === 3) {
          this.loadingService.closeSpinner();
           this.showSuccess = false;
           this.showError = true;
          this.processFinish$.next(true);
         }
        }
      } catch {
        this.processFinish$.next(null);
      }
    });
  }
}

