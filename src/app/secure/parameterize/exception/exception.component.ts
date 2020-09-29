import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@app/core';
import { StoreModel } from '@app/secure/offers/stores/models/store.model';
import { EventEmitterSeller } from '@app/shared/events/eventEmitter-seller.service';

@Component({
  selector: 'app-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss']
})
export class ExceptionComponent implements OnInit {


  currentStoreSelect: StoreModel = new StoreModel(0, '');

  activeException: Boolean = false;

  constructor(
    private emitterSeller: EventEmitterSeller,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.selectSeller();
  }

  selectSeller() {
    this.loadingService.viewSpinner();
    this.emitterSeller.eventSearchSeller.subscribe(data => {
      if (data) {
        this.currentStoreSelect = data;
        this.activeException = true;
      }
      this.loadingService.closeSpinner();
    });
  }

}
