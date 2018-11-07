import { Component, OnInit } from '@angular/core';
import { ShippingMethodsService } from './shipping-methods.service';
import { ShippingMethodsModel } from './shipping-methods.model';
import { Logger } from '@app/core';
import { QuotingAdminService } from '../quoting-administrator.service';
import { LoadingService } from '@app/core';
import { ModalService } from '@app/core';


const log = new Logger('CreateDialogComponent');

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.scss']
})
export class ShippingMethodsComponent implements OnInit {

  public shippingMethodsList: Array<ShippingMethodsModel>;

  constructor(private service: ShippingMethodsService,
              private quotingService: QuotingAdminService,
              private loadingService: LoadingService,
              private modalService: ModalService) { }

  ngOnInit(): void {
    this.getRequiredData();
  }

  /**
   * Get from shiping methods a list with it
   *
   * @memberof ShippingMethodsComponent
   */
  public getRequiredData(): void {
    this.loadingService.viewSpinner();
    this.service.getShippingMethods().subscribe((res: any) => {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body);
        this.shippingMethodsList = body.Data;
        /** Valida if needs to show spinner, because doesnt finished required services */
        if (this.quotingService.getNumberOfService()) {
          this.loadingService.closeSpinner();
        } else {
          this.loadingService.viewSpinner();
        }
      } else {
        this.modalService.showModal('errorService');
        log.error('Error al intentar obtener los metodos de envios');
      }
    });
  }
}
