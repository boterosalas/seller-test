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
    MatDividerModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { DialogProfileComponent } from './dialog/profile-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        FlexLayoutModule,
        MatToolbarModule,
        BrowserModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatDialogModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatInputModule,
        FormsModule,
        CommonModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatDividerModule
    ],
    declarations: [
        ProfileComponent,
        DialogProfileComponent
    ],
    providers: [
        ProfileService
    ],
    entryComponents: [
        DialogProfileComponent
    ]
})

export class ProfileModule {

}

