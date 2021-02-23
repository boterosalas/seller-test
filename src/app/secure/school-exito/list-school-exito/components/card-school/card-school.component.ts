import { Component, OnInit, Input } from "@angular/core";
import { MatDialog } from "@angular/material";
import { CreateSubmoduleComponent } from "../create-submodule/create-submodule.component";
import { DeleteItemModuleComponent } from "../delete-item-module/delete-item-module.component";
import { DeleteModuleComponent } from "../delete-module/delete-module.component";
import { EditItemModuleComponent } from "../edit-item-module/edit-item-module.component";
import { EditModuleComponent } from "../edit-module/edit-module.component";

@Component({
  selector: "app-card-school",
  templateUrl: "./card-school.component.html",
  styleUrls: ["./card-school.component.scss"],
})
export class CardSchoolComponent implements OnInit {
  @Input() data: any;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  /**
   *
   * @param item recibe los datos del modulo
   */

  editFaq(item: any) {
    this.dialog.open(EditModuleComponent, {
      data: item,
      width: "800px",
      maxWidth: "90vw",
      maxHeight: "90vh",
    });
  }

  deleteFaq(item: any) {
    this.dialog.open(DeleteModuleComponent, {
      data: item,
      width: "800px",
      maxWidth: "90vw",
      maxHeight: "90vh",
    });
  }

  editItemFaq(module: any, item: any) {
    this.dialog.open(EditItemModuleComponent, {
      data: {
        module,
        item,
      },
      width: "800px",
      maxWidth: "90vw",
      maxHeight: "90vh",
    });
  }

  deleteItemFaq(module: any, item: any) {
    this.dialog.open(DeleteItemModuleComponent, {
      data: {
        module,
        item,
      },
      width: "800px",
      maxWidth: "90vw",
      maxHeight: "90vh",
    });
  }

  /**
   *
   * @param param0 recibe el archivo para ser descargado
   */

  downloadItemFaq({ File }: any) {
    window.open(File, "_blank");
  }

  createSubmodule(module: any, item: any) {
    this.dialog.open(CreateSubmoduleComponent, {
      data: {
        module,
        item,
      },
      width: "800px",
      maxWidth: "90vw",
      maxHeight: "90vh",
    });
  }
}
