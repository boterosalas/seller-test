import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router } from "@angular/router";
import { SchoolExitoService } from "@app/secure/school-exito/school-exito.service";
import { ComponentsService } from "@app/shared";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-edit-module",
  templateUrl: "./edit-module.component.html",
  styleUrls: ["./edit-module.component.scss"],
})
export class EditModuleComponent implements OnInit {
  formEditModule: FormGroup;
  dataToEdit: any;
  changeValueEdit: boolean = true;

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditModuleComponent>,
    public _schoolExito: SchoolExitoService,
    public componentService: ComponentsService,
    private languageService: TranslateService,
    private router: Router
  ) {
    this.dataToEdit = data;
  }

  /**
   * Formulario de edicion del modulo
   */

  public editFormModule() {
    this.formEditModule = this.fb.group({
      moduleName: new FormControl(this.dataToEdit.ModuleName, Validators.required),
    });
  }

  ngOnInit() {
    this.editFormModule();
  }

  /**
   * cierra la modal
   */

  public close(): void {
    this.dialogRef.close();
  }

  /**
   * Servicio para editar los modulos
   */


  public editModule() {
    const newNameModule = this.formEditModule.controls.moduleName.value;
    const {ModuleName}  = this.dataToEdit;
    const data = {
      OldName: ModuleName,
      NewName: newNameModule
    }

    this._schoolExito.editModules(data).subscribe((resp:any) => {
      let body = JSON.parse(resp.body);
      if (resp.statusCode === 200) {
        this.componentService.openSnackBar(this.languageService.instant('school.exito.edit.module.service'), this.languageService.instant('actions.close'), 5000);
        this.dialogRef.close();
        this.router.navigateByUrl('/SchoolExitoComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/securehome/escuela-exito']);
      }); 
      } else {
        this.componentService.openSnackBar(body.Errors[0].Message, this.languageService.instant('actions.close'), 5000);
      } 
    })
    
  }

   /**
   * detecta los cambios en el formulario y validad 
   * que el nombre del modulo y el que se va enviar sean iguales para desactivar el boton 
   */


  public changeValue() {
    this.formEditModule.valueChanges.subscribe(({moduleName}) => {
      if(moduleName === this.dataToEdit.ModuleName) {
        this.changeValueEdit = true;
      } else{
        this.changeValueEdit = false;
      }
    });
  }

}
