import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

import { MaterialModule } from '@app/material.module';
import { CoreModule } from '@core/core.module';
import { SendModerationFormatModalComponent } from '@secure/products/bulk-load-product-moderation/send-moderation-format-modal/send-moderation-format-modal.component';
import { BulkLoadModule } from '@shared/components/bulk-load/bulk-load.module';
import { TypeEvents } from '@shared/components/bulk-load/models/bulk-load.model';
import { SharedModule } from '@shared/shared.module';

import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation.component';


describe('Módulo de moderación de productos:', () => {
  let comp: BulkLoadProductModerationComponent;
  let fixture: ComponentFixture<BulkLoadProductModerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
        CoreModule,
        BulkLoadModule
      ],
      declarations: [
        BulkLoadProductModerationComponent,
        SendModerationFormatModalComponent
      ]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [SendModerationFormatModalComponent]
      }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkLoadProductModerationComponent);
    comp = fixture.componentInstance;
  });

  it('Debe crearse el componente.', () => {
    expect(comp).toBeTruthy();
  });

  it('Debe tener una configuración mínima para "BulkLoadComponent".', () => {
    expect(comp.config.title).toBeDefined();
    comp.ngAfterViewInit();
    expect(comp.config.mainContentTpl).toBeDefined();
  });

  it('#manageEvents debe generar una referencia a la modal de tipo "SendModerationFormatModalComponent".', () => {
    comp.manageEvents({
      type: TypeEvents.download
    });
    expect(comp.dialogRef).toBeDefined();
  });
});
