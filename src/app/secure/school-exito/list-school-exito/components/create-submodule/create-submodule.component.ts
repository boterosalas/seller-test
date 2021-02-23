import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { SchoolExitoService } from "@app/secure/school-exito/school-exito.service";
import { ComponentsService } from "@app/shared";
import { TranslateService } from "@ngx-translate/core";
import { EditModuleComponent } from "../edit-module/edit-module.component";

@Component({
  selector: "app-create-submodule",
  templateUrl: "./create-submodule.component.html",
  styleUrls: ["./create-submodule.component.scss"],
})
export class CreateSubmoduleComponent implements OnInit {
  createSubModule: FormGroup;
  dataToEdit: any;
  changeValueEdit: boolean = true;
  manualEsp: String;
  manualIng: String;
  oneEspFile: Boolean = true;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditModuleComponent>,
    public snackBar: MatSnackBar,
    public _schoolExito: SchoolExitoService,
    public componentService: ComponentsService, // private languageService: TranslateService, // private router: Router
    private languageService: TranslateService,
    private router: Router
  ) {
    this.data = data;
  }

  /**
   * Formulario de crear submodulo
   */

  public createFormModule() {
    this.createSubModule = this.fb.group({
      subModuleName: new FormControl("", Validators.required),
    });
  }

  ngOnInit() {
    this.createFormModule();
  }

  /**
   * cierra la modal
   */

  public close(): void {
    this.dialogRef.close();
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
   * @param param0 recibe la data del archivo b64 en ingles
   */

  public addFileIng({data}) {
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
   * servicio para crear submodulos
   */


  public createSubModules() {
    const { item, module } = this.data;
    let ModuleName = module.ModuleName;
    let subModuleName = this.createSubModule.controls.subModuleName.value;
   
    let fileEsp = {
      Pdf: this.manualEsp,
      Language: "es-CO",
    };

    let fileIng = {
      Pdf: this.manualIng,
      Language: "en-US",
    };

    if (fileEsp.Pdf === undefined) {
      fileEsp = {
        Pdf: "",
        Language: "es-CO",
      };
    }

    if (fileIng.Pdf === undefined) {
      fileIng = {
        Pdf: "",
        Language: "en-US",
      };
    }

    let data = {
      subModuleName,
      Files: [fileEsp, fileIng],
    };

    this._schoolExito.createSubModules(ModuleName, data).subscribe((resp: any) => {
      let body = JSON.parse(resp.body);
      if (resp.statusCode === 200) {
        this.componentService.openSnackBar(
          this.languageService.instant("school.exito.edit.submodule.service"),
          this.languageService.instant("actions.close"),
          5000
        );
        this.dialogRef.close();
        this.router
          .navigateByUrl("/SchoolExitoComponent", { skipLocationChange: true })
          .then(() => {
            this.router.navigate(["/securehome/escuela-exito"]);
          });
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
