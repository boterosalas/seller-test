import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-info-indicators',
  templateUrl: './info-indicators.component.html',
  styleUrls: ['./info-indicators.component.scss']
})
export class InfoIndicatorsComponent implements OnInit {

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<InfoIndicatorsComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  ngOnInit() {}

/**
 * funcion para cerrar el mensaje inferior
 *
 * @memberof InfoIndicatorsComponent
 */
close(): void {
    this._bottomSheetRef.dismiss();
  }

}
