import { NgModule } from '@angular/core';
import { ProfileService } from './profile.service';
import { ProfileComponent } from './profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
    imports: [
        FlexLayoutModule,
        MatToolbarModule,
        BrowserModule
    ],
    declarations: [
        ProfileComponent
    ],
    providers: [
        ProfileService
    ]
})

export class ProfileModule {

}

