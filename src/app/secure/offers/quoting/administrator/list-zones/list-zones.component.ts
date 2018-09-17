import { Component, OnInit } from '@angular/core';
import { ListZonesService } from './list-zones.service';
import { Logger } from '@app/core';

const log = new Logger('ListZonesComponent');

@Component({
  selector: 'app-list-zones',
  templateUrl: './list-zones.component.html',
  styleUrls: ['./list-zones.component.scss']
})
export class ListZonesComponent implements OnInit {
  public listZones: Array<{}>;

  constructor(
    private service: ListZonesService
  ) { }

  ngOnInit(): void {
    this.getListZones();
  }

  getListZones() {
    this.listZones = this.service.getFakeListZones();
  }

  createZone() {
    log.debug('Crear');
  }

  editZone() {
    log.debug('Editar');
  }

  deleteZone() {
    log.debug('Eliminar');
  }

}
