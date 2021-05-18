import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalAdvertisementsComponent } from '../modal-advertisements/modal-advertisements.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.scss']
})
export class AdvertisementsComponent implements OnInit {

  constructor(
    private _dashboard: DashboardService,
    public dialog: MatDialog
  ) { }
  

  public advertisements = [];
  public page1 = true;
  public page2 = false;

  ngOnInit() {
    this.listAdvertisements();
  }

  /**
   * Obtiene el listado de los anunucios
   */

  public listAdvertisements() {
    this._dashboard.getAdvertisements().subscribe(({Data}) => {
      this.advertisements = Data;
    })
  }

  /**
   * Muetsra la pagina 2 y oculta la pagina 1
   */

  public showPage2() {
    this.page1 = false;
    this.page2 = true;
  }

  /**
   * Muetsra la pagina 1 y oculta la pagina 2
   */

  public showPage1() {
    this.page1 = true;
    this.page2 = false;
  }

  /**
   * 
   * @param adv recibe la data del servicio para enviarla a la modal
   */

  public openAdv(adv:any) {
    const dialogref = this.dialog.open(ModalAdvertisementsComponent, {
      data:adv,
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    this._dashboard.readAdvertisements(adv.Id).subscribe();
    dialogref.afterClosed().subscribe(()=> this.listAdvertisements());

  }

}
