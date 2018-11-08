import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '@app/material.module';
import { SendModerationFormatModalComponent } from '@secure/products/bulk-load-product-moderation/send-moderation-format-modal/send-moderation-format-modal.component';
import { BulkLoadModule } from '@shared/components/bulk-load/bulk-load.module';
import { SharedModule } from '@shared/shared.module';

import { BulkLoadProductModerationComponent } from './bulk-load-product-moderation.component';


describe('Módulo de moderación de productos.', () => {
  let component: BulkLoadProductModerationComponent;
  let fixture: ComponentFixture<BulkLoadProductModerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
        BulkLoadModule
      ],
      declarations: [
        BulkLoadProductModerationComponent,
        SendModerationFormatModalComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkLoadProductModerationComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('Debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });
});
