import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MyProfileService } from '@app/secure/aws-cognito/profile/myprofile.service';
import { LoadingService } from '@app/core';

@Component({
  selector: 'app-drop-down-list-header',
  templateUrl: './drop-down-list-header.component.html',
  styleUrls: ['./drop-down-list-header.component.scss']
})
export class DropDownListHeaderComponent implements OnInit {
  @Input() configurations: Array<Configuration>;
  // Variable para determinar que tipo de perfil esta logueado y determinar los headers
  hideHeader: any;
  // Copia del array del listado de headers
  copyConfigurations: Configuration[];

  constructor(
  ) {
    if (localStorage.getItem('typeProfile') === 'administrator') {
      this.hideHeader = false;
    } else {
      this.hideHeader = true;
    }
  }

  ngOnInit() {
    // this.showHeader();
  }

  // Se deja codigo comentado que era la configuración de los headers por si alguna cosa.
  // showHeader() {
  //   console.log(this.copyConfigurations);
  //   console.log(this.configurations);

  //   if (this.hideHeader) {
  //     this.configurations = this.configurations;
  //   } else {
  //     this.copyConfigurations = [...this.configurations];
  //     this.copyConfigurations.splice(5, 1);
  //     console.log(this.copyConfigurations);
  //   }
  // }
}


export interface Configuration {
  name: string;
  displayName: String;
  xs?: number; // No implemented
  sm?: number; // No implemented
  md?: number;
  lg?: number; // No implemented
  xl?: number; // No implemented
}
