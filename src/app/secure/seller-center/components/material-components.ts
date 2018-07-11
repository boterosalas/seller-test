/* 3rd party components */
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
    MatButtonModule,
    MatExpansionModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatInputModule,
    MatGridListModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDialogModule,
    MatStepperModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatMenuModule,
    MatSortModule,
    MatDatepickerModule,
    MatRippleModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSliderModule
} from '@angular/material';

import { MatTreeModule } from '@angular/material/tree';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

/**
 *  Módulo que permitira importar los componentes de Angular material y Angular Flex layout en el app.module.
 *
 * [Angular material]{@link https://material.angular.io/}
 * [Flex Layout]{@link https://tburleson-layouts-demos.firebaseapp.com/#/docs}
 */
@NgModule({
    imports: [
        // Angular Material
        MatButtonModule,
        MatMenuModule,
        MatTabsModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatNativeDateModule,
        MatTableModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatIconModule,
        MatCardModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatTableModule,
        MatExpansionModule,
        MatListModule,
        MatStepperModule,
        MatInputModule,
        MatGridListModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatSelectModule,
        MatTooltipModule,
        MatSortModule,
        MatRippleModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSliderModule,
        MatTreeModule,
        // Flex layout
        FlexLayoutModule,
    ],
    exports: [
        // Angular Material
        MatButtonModule,
        MatMenuModule,
        MatTabsModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatDatepickerModule,
        MatCardModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatDialogModule,
        MatFormFieldModule,
        MatTableModule,
        MatExpansionModule,
        MatListModule,
        MatStepperModule,
        MatInputModule,
        MatGridListModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatSelectModule,
        MatTooltipModule,
        MatSortModule,
        MatRippleModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSliderModule,
        MatTreeModule,
        // Flex layout
        FlexLayoutModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class MaterialModule {
}
