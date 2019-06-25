import { Component, Output, EventEmitter  } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-case-toolbar",
  templateUrl: "./case-toolbar.component.html",
  styleUrls: ["./case-toolbar.component.scss"]
})
export class CaseToolbarComponent {

  @Output() eventFilter: EventEmitter<boolean> = new EventEmitter<boolean>();
  stateFilter: boolean = false;

   // Limite de registros
   lengthOrder = 100;
   // Numero de paginas por defecto
   pageSizeOrder = 50;


  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  constructor(private breakpointObserver: BreakpointObserver) { }

  toggleFilter() {

    this.eventFilter.emit(!this.stateFilter);
  }

}
