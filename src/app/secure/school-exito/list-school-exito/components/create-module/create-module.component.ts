import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSnackBar,
} from "@angular/material";
import { SchoolExitoService } from "@app/secure/school-exito/school-exito.service";
import { ComponentsService } from "@app/shared";
import { TranslateService } from "@ngx-translate/core";
import { EditModuleComponent } from "../edit-module/edit-module.component";

@Component({
  selector: "app-create-module",
  templateUrl: "./create-module.component.html",
  styleUrls: ["./create-module.component.scss"],
})
export class CreateModuleComponent implements OnInit {
  createModule: FormGroup;
  manualEsp: String;
  manualIng: String;
  oneEspFile: Boolean = true;
  module = [];
  itemModule: any;
  visible = true;
  selectable = true;
  removable = true;
  activeSave: Boolean = true;
  activeAddSubmodule: Boolean = true;
  filesEsp = [];
  filesIng = [];
  moduleName:String;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditModuleComponent>,
    public snackBar: MatSnackBar,
    public _schoolExito: SchoolExitoService,
    public componentService: ComponentsService, // private languageService: TranslateService, // private router: Router
    private languageService: TranslateService
  ) {}

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
      moduleName: new FormControl("", Validators.required),
      subModuleName: new FormControl(""),
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
    if (data !== "") {
      this.manualEsp = data;
      this.oneEspFile = false;
    }
  }

   /**
   * 
   * @param param0 recibe la data del archivo b64 en ingles
   */

  public addFileIng({ data }) {
    if (data !== "") {
      this.manualIng = data;
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
   * Funcion que añade el submodulo al arreglo
   */

  public addSubmodule() {
    this.moduleName = this.createModule.controls.moduleName.value;
    let subModuleName = this.createModule.controls.subModuleName.value;

    if (this.module.length) {
      this.activeSave = false;
    }

    let fileEsp = {
      Pdf: this.manualEsp,
      Language: "es-CO",
    };

    let fileIng = {
      Pdf: this.manualIng,
      Language: "en-US",
    };

    if (this.manualEsp === undefined) {
      fileEsp = {
        Pdf: "",
        Language: "es-CO",
      };
    }

    if (this.manualIng === undefined) {
      fileIng = {
        Pdf: "",
        Language: "",
      };
    }

    let data = {
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

    this.createModule.controls.subModuleName.reset("");
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
        if (subModuleName !== "" && moduleName !== "") {
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

        if (subModuleName === "") {
          this.activeAddSubmodule = true;
          this.activeSave = true;
        }

        
        if (this.module.length > 0 && moduleName !== "" && subModuleName === "") {
          this.activeSave = false;
        }

        if (this.module.length === 0 && moduleName !== "" && subModuleName === "") {
          this.activeSave = true;
        }
      }
    );
  }

  /**
   * llama al servicio de crear el modulo
   */

  public createModules() {
    this.module[0].Modulename = this.createModule.controls.moduleName.value;
    this._schoolExito.createModules(this.module[0]).subscribe((resp: any) => {
      let body = JSON.parse(resp.body);
      if (resp.statusCode === 200) {
        this.componentService.openSnackBar(
          this.languageService.instant("school.exito.create.module.service"),
          this.languageService.instant("actions.close"),
          5000
        );
        this.dialogRef.close();
        setTimeout(() => {
          location.reload();
        }, 1000);
      } else {
        this.componentService.openSnackBar(
          body.Errors[0].Message,
          this.languageService.instant("actions.close"),
          5000
        );
      }
    });
  }
}
