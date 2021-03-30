import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { InfoIndicatorsComponent } from '../info-indicators/info-indicators.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-quality-indicators',
  templateUrl: './quality-indicators.component.html',
  styleUrls: ['./quality-indicators.component.scss']
})


export class QualityIndicatorsComponent implements OnInit {

  public _idSeller;
  @Input() set idSeller(value: boolean) {
    this._idSeller = value;
    console.log(this._idSeller);
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
  ) { }

  ngOnInit() {
    this.getIndicators();
    this.changeLanguaje();
  }
  /**
   * funcion para capturar todos los indicadores
   *
   * @memberof QualityIndicatorsComponent
   */
  getIndicators() {
    this.idSeller = this.idSeller ? this.idSeller : null;
    this._dashboard.getIndicators(this.idSeller).subscribe(result => {
      this.load = false;
      if (result && result.errors === null) {
        this.qualityIndicators = result.data;
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
    }, error => {
      this.snackBar.open(this.languageService.instant('public.auth.forgot.error_try_again') + (error), this.languageService.instant('actions.close'), {
        duration: 5000,
      });
    });
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
