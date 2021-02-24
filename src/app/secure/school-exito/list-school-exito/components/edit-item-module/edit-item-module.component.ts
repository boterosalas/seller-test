import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { SchoolExitoService } from "@app/secure/school-exito/school-exito.service";
import { ComponentsService } from "@app/shared";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-edit-item-module",
  templateUrl: "./edit-item-module.component.html",
  styleUrls: ["./edit-item-module.component.scss"],
})
export class EditItemModuleComponent implements OnInit {
  formEditModule: FormGroup;
  dataToEdit: any;
  changeValueEdit: boolean = true;
  manualEsp: String;
  manualIng: String;
  oneEspFile: Boolean = true;
  validateFile: Boolean = true;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditItemModuleComponent>,
    public _schoolExito: SchoolExitoService,
    public componentService: ComponentsService, // private languageService: TranslateService, // private router: Router
    private languageService: TranslateService,
    private router: Router
  ) {
    this.dataToEdit = data;
  }

  /**
   * Formulario de edicion de los submodulos
   */

  public editFormModule() {
    this.formEditModule = this.fb.group({
      SubModuleName: new FormControl(
        this.dataToEdit.item.SubModuleName,
        Validators.required
      ),
    });
  }

  ngOnInit() {
    this.editFormModule();
  }

  /**
   * cierrra la modal
   */

  public close(): void {
    this.dialogRef.close();
  }

  /**
   * Servicio para editar el submodulo
   */

  public editModule() {
    const { item, module } = this.dataToEdit;
    let ModuleName = module.ModuleName;
    let OldName = item.SubModuleName;
    let NewName = this.formEditModule.controls.SubModuleName.value;

    let fileEsp = {
      Pdf: this.manualEsp,
      Language: "es-CO",
    };

    let fileIng = {
      Pdf: this.manualIng,
      Language: "es-Us",
    };

    if(fileEsp.Pdf === undefined) {
      fileEsp = {
        Pdf: '',
        Language: "es-CO",
      }
    }

    if(fileIng.Pdf === undefined) {
      fileIng = {
        Pdf: '',
        Language: "es-Us",
      }
    }

    let data = {
      ModuleName,
      OldName,
      NewName,
      Files: [fileEsp, fileIng],
    };

    this._schoolExito.editSubModules(data).subscribe((resp:any) => {
      let body = JSON.parse(resp.body);
      if (resp.statusCode === 200) {
        this.componentService.openSnackBar(this.languageService.instant('school.exito.edit.submodule.service'), this.languageService.instant('actions.close'), 5000);
        this.dialogRef.close();
        this.router.navigateByUrl('/SchoolExitoComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/securehome/schoolExito/list-school-exito']);
      }); 
      } else {
        this.componentService.openSnackBar(body.Errors[0].Message, this.languageService.instant('actions.close'), 5000);
      } 
    })

  }

  /**
   * 
   * @param param0 recibe la data del archivo b64 en español
   */

  public addFileEsp({data}) {
    if (data !== "") {
      this.manualEsp = data;
      this.oneEspFile = false;
    }
  }
  
 
   /**
   * 
   * @param value recibe un booleano que por lo menos este el archivo en español
   */

  public onefileEsp(value) {
    setTimeout(() => {
      this.oneEspFile = value;
    });
  }

  /**
   * 
   * @param param0 recibe la data del archivo b64 en ingles
   */

  public addFileIng({data}) {
    if (data !== "") {
      this.manualIng = data;
    }
  }

  /**
   * detecta los cambios en el formulario y validad 
   * que el nombre del modulo y el que se va enviar sean iguales para desactivar el boton 
   */

  public changeValue() {
    this.formEditModule.valueChanges.subscribe(({ SubModuleName }) => {
      const {item} = this.dataToEdit;
      if (SubModuleName === item.SubModuleName) {
        this.changeValueEdit = true;
      } else {
        this.changeValueEdit = false;
      }
    });
  }
}
