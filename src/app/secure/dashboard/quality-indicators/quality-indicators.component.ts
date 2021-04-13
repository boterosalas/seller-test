import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LoadingService } from '@app/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { mapValues } from 'lodash';
import { InfoIndicatorsComponent } from '../info-indicators/info-indicators.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-quality-indicators',
  templateUrl: './quality-indicators.component.html',
  styleUrls: ['./quality-indicators.component.scss']
})


export class QualityIndicatorsComponent implements OnInit {

  public _idSeller;
  public type: string;
  public consult: boolean;
  @Input() set params(value: any) {
    if (value && value.consult === true) {
      this.load = false;
      this._idSeller = value.idSeller;
      this.type = value.type;
      this.consult = value.consult;
      const params = '?sellerId=' + this._idSeller;
      this.getIndicators(params);
    } else {
      this.load = false;
      this.type = value.type;
      this.consult = value.consult;
      this.qualityIndicators = [];
      this._idSeller = null;
    }
}
  public qualityIndicators: any;
  public load = true;
  public from = '';
  public to = '';
  constructor(
    private _btnInfo: MatBottomSheet,
    private _dashboard: DashboardService,
    private languageService: TranslateService,
    public snackBar?: MatSnackBar,
    private loadingService?: LoadingService,
  ) { }

  ngOnInit() {
    this.changeLanguaje();
  }
  /**
   * funcion para capturar todos los indicadores
   *
   * @memberof QualityIndicatorsComponent
   */
  getIndicators(params?: any) {
    if (this.type === 'admin') {
      this.loadingService.viewSpinner();
    }
    this.load = true;
    this._dashboard.getIndicators(params).subscribe(result => {
      this.load = false;
      if (result && result.errors === null) {
        this.qualityIndicators = this.mapItems(result.data);
        if (this.qualityIndicators.length > 0) {
          this.from = this.qualityIndicators[0] ? this.qualityIndicators[0].initialDate : '';
          this.to = this.qualityIndicators[0] ? this.qualityIndicators[0].finalDate : '';
        }
      } else {
        this.qualityIndicators = [];
        this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again'), this.languageService.instant('actions.close'), {
          duration: 5000,
        });
      }
      if (this.type === 'admin') {
        this.loadingService.closeSpinner();
      }
    }, error => {
      this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again') + (error), this.languageService.instant('actions.close'), {
        duration: 5000,
      });
    });
  }


    /**
     *funcion para mapear el resultado del servicio get all brands
     * @param {any[]} items
     * @returns {any[]}
     * @memberof BrandsComponent
     */
     mapItems(items: any[]): any[] {
      return items.map(x => {
          return {
            calcInformation: x.calcInformation,
            color:x.color,
            finalDate:x.finalDate,
            goal:x.goal,
            indicatorName:x.indicatorName,
            initialDate:x.initialDate,
            measureUnit:x.measureUnit,
            percentageBar:x.percentageBar,
            sellerId: x.sellerId,
            symbol: x.symbol,
            value: x.value,
            message : this.validateMessage(x.color)
          };
      });
  }


  validateMessage (color: string){
    let msj = '';
    if(color === 'Green') {
      msj = this.languageService.instant('quality.indicators.bar_green')
    } else if (color === 'Orange') {
      msj = this.languageService.instant('quality.indicators.bar_orange')
    } else if(color === 'Red') {
      msj = this.languageService.instant('quality.indicators.bar_red')
    }
    return msj;
  }

  
  /**
   * funcion para cambiar la cultura
   *
   * @memberof QualityIndicatorsComponent
   */
  changeLanguaje() {
    this.languageService.onLangChange.subscribe((event: LangChangeEvent) => {
      localStorage.setItem('culture_current', event['lang']);
      this.load = true;
      this.getIndicators();
    });
  }
  /**
   * funcion para abrir el mensaje inferior
   *
   * @param {string} title
   * @param {string} text
   * @memberof QualityIndicatorsComponent
   */
  openBtnInfo(title: string, text: string): void {
    this._btnInfo.open(InfoIndicatorsComponent,
      {
        data: {
          'title': title,
          'body': text
        }
      }
    );
  }
}
