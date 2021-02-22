import { Component, OnInit } from '@angular/core';
import { SchoolExitoService } from '../../school-exito.service';

@Component({
  selector: 'app-list-seller-school',
  templateUrl: './list-seller-school.component.html',
  styleUrls: ['./list-seller-school.component.scss']
})
export class ListSellerSchoolComponent implements OnInit {

  public modules: Array<number> = [];

  constructor(
    private schoolExitoService: SchoolExitoService
  ) { }

  ngOnInit() {
    this.getAllModules();
  }

  getAllModules() {
    this.schoolExitoService.getAllModuleSchoolExito(null).subscribe(result => {
      if (result && result.statusCode === 200) {
        const { body } = result;
        this.modules = JSON.parse(body).Data;
        console.log(this.modules);
      } else {
        console.log('error');
      }
    });
  }

  downloadFile(urlFile: string) {
    window.open(urlFile, '_back');
  }

}
