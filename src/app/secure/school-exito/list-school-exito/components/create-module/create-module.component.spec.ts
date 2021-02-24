import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { EndpointService } from '@app/core';
import { ShellModule } from '@app/core/shell/shell.module';
import { MaterialModule } from '@app/material.module';
import { SchoolExitoModule } from '@app/secure/school-exito/school-exito.module';
import { ComponentsService } from '@app/shared/services/components.service';
import { TranslateModule } from '@ngx-translate/core';
import { ngfModule } from 'angular-file';

import { CreateModuleComponent } from './create-module.component';

describe('CreateModuleComponent', () => {
  let component: CreateModuleComponent;
  let fixture: ComponentFixture<CreateModuleComponent>;

  const mockDialog = jasmine.createSpyObj('MatDialogRef', ['open, close, afterClosed']);
  let data = {};

  let fileb64="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NTYgNTU2IDU1NiA1NTYgNTU2IDU1NiAzMzMgMzMzIDU4NCA1ODQgNTg0IDYxMSA5NzUgNzIyIDcyMiA3MjIgNzIyIDY2NyANCjYxMSA3NzggNzIyIDI3OCA1NTYgNzIyIDYxMSA4MzMgNzIyIDc3OCA2NjcgNzc4IDcyMiA2NjcgNjExIDcyMiA2NjcgOTQ0IDY2NyANCjY2NyA2MTEgMzMzIDI3OCAzMzMgNTg0IDU1NiAzMzMgNTU2IDYxMSA1NTYgNjExIDU1NiAzMzMgNjExIDYxMSAyNzggMjc4IDU1NiANCjI3OCA4ODkgNjExIDYxMSA2MTEgNjExIDM4OSA1NTYgMzMzIDYxMSA1NTYgNzc4IDU1NiA1NTYgNTAwIDM4OSAyODAgMzg5IDU4NCANCjAgNTU2IDAgMjc4IDU1NiA1MDAgMTAwMCA1NTYgNTU2IDMzMyAxMDAwIDY2NyAzMzMgMTAwMCAwIDYxMSAwIDAgMjc4IDI3OCA1MDAgDQo1MDAgMzUwIDU1NiAxMDAwIDMzMyAxMDAwIDU1NiAzMzMgOTQ0IDAgNTAwIDY2NyAyNzggMzMzIDU1NiA1NTYgNTU2IDU1NiAyODAgDQo1NTYgMzMzIDczNyAzNzAgNTU2IDU4NCAzMzMgNzM3IDU1MiA0MDAgNTQ5IDMzMyAzMzMgMzMzIDU3NiA1NTYgMzMzIDMzMyAzMzMgDQozNjUgNTU2IDgzNCA4MzQgODM0IDYxMSA3MjIgNzIyIDcyMiA3MjIgNzIyIDcyMiAxMDAwIDcyMiA2NjcgNjY3IDY2NyA2NjcgMjc4IA0KMjc4IDI3OCAyNzggNzIyIDcyMiA3NzggNzc4IDc3OCA3NzggNzc4IDU4NCA3NzggNzIyIDcyMiA3MjIgNzIyIDY2NyA2NjcgNjExIA0KNTU2IDU1NiA1NTYgNTU2IDU1NiA1NTYgODg5IDU1NiA1NTYgNTU2IDU1NiA1NTYgMjc4IDI3OCAyNzggMjc4IDYxMSA2MTEgNjExIA0KNjExIDYxMSA2MTEgNjExIDU0OSA2MTEgNjExIDYxMSA2MTEgNjExIDU1NiA2MTEgNTU2IF0NCmVuZG9iag0KMTMgMCBvYmoNCjw8DQovVHlwZSAvRm9udERlc2NyaXB0b3INCi9Gb250TmFtZSAvQXJpYWxNVCxCb2xkDQovQXNjZW50IDcyOA0KL0NhcEhlaWdodCA1MDANCi9EZXNjZW50IC0yMTANCi9GbGFncyAzMg0KL0ZvbnRCQm94IFstNjI4IC0zNzYgMjAwMCAxMDE4XQ0KL0l0YWxpY0FuZ2xlIDANCi9TdGVtViAwDQovQXZnV2lkdGggNDc5DQovTGVhZGluZyAxNTANCi9NYXhXaWR0aCAyNjI4DQovWEhlaWdodCAyNTANCj4+DQplbmRvYmoNCjEgMCBvYmoNCjw8DQovRCBbOCAwIFIgL1hZWiAtNCA4NDYgMF0NCj4+DQplbmRvYmoNCjIgMCBvYmoNCjw8DQovS2lkcyBbMyAwIFJdDQo+Pg0KZW5kb2JqDQozIDAgb2JqDQo8PA0KL0xpbWl0cyBbPGZlZmYwMDVmMDA1MDAwNDEwMDQ3MDA0NTAwMzE+IDxmZWZmMDA1ZjAwNTAwMDQxMDA0NzAwNDUwMDMxPl0NCi9OYW1lcyBbPGZlZmYwMDVmMDA1MDAwNDEwMDQ3MDA0NTAwMzE+IDEgMCBSXQ0KPj4NCmVuZG9iag0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0tpZHMgWzggMCBSXQ0KL0NvdW50IDENCj4+DQplbmRvYmoNCjUgMCBvYmoNCjw8DQovQ3JlYXRpb25EYXRlIDxmZWZmMDA0NDAwM2EwMDMyMDAzMDAwMzEwMDMxMDAzMTAwMzAwMDMyMDAzMTAwMzAwMDM4MDAzNDAwMzUwMDMyMDAzMDAwNWE+DQovTW9kRGF0ZSA8ZmVmZjAwNDQwMDNhMDAzMjAwMzAwMDMxMDAzMTAwMzEwMDMwMDAzMjAwMzEwMDMwMDAzODAwMzQwMDM1MDAzMjAwMzAwMDVhPg0KL1Byb2R1Y2VyIDxmZWZmMDA0MzAwNmYwMDcyMDA2NTAwNmMwMDIwMDA1MDAwNDQwMDQ2MDAyMDAwNDUwMDZlMDA2NzAwNjkwMDZlMDA2NTAwMjAwMDU2MDA2NTAwNzIwMDczMDA2OTAwNmYwMDZlMDAyMDAwMzEwMDM0MDAyZTAwMzAwMDJlMDAzMDAwMmUwMDM1MDAzNjAwMzc+DQovQXV0aG9yIDxmZWZmMDA1NTAwNzMwMDc1MDA2MTAwNzIwMDY5MDA2Zj4NCi9DcmVhdG9yIDxmZWZmMDA0MzAwNmYwMDcyMDA2NTAwNmMwMDQ0MDA1MjAwNDEwMDU3Pg0KL1RpdGxlIDxmZWZmMDA0NzAwNzIwMGUxMDA2NjAwNjkwMDYzMDA2ZjAwMzE+DQo+Pg0KZW5kb2JqDQp4cmVmDQowIDYNCjAwMDAwMDAwMDAgNjU1MzUgZg0KMDAwMDAwMjg4NyAwMDAwMCBuDQowMDAwMDAyOTM4IDAwMDAwIG4NCjAwMDAwMDI5NzggMDAwMDAgbg0KMDAwMDAwMzEyMyAwMDAwMCBuDQowMDAwMDAzMTg3IDAwMDAwIG4NCnRyYWlsZXINCjw8DQovU2l6ZSA2DQovSUQgWzwxZTllNGE1YzkxMTRkYjBhY2FiYTJkNDNmMDQwYTE2ZT48MWU5ZTRhNWM5MTE0ZGIwYWNhYmEyZDQzZjA0MGExNmU+XQ0KPj4NCnN0YXJ0eHJlZg0KMTQzDQolJUVPRg==";

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot({}),
        ngfModule,
        BrowserAnimationsModule,
        SchoolExitoModule,
        ShellModule,
        RouterTestingModule
      ],
      providers: [
        EndpointService,
        ComponentsService,
        { provide: MatDialogRef, useValue: mockDialog },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    }).compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(CreateModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add file esp with file', () => {
    component.addFileEsp({data: fileb64});
    expect(component.oneEspFile).toBeFalsy();
  });
  
  it('add file esp without file', () => {
    component.addFileEsp({data: ''});
    expect(component.oneEspFile).toBeTruthy();
  });
  
  it('add file ing with file', () => {
    component.addFileIng({data: fileb64});
    expect(fileb64).not.toBeNull();
  });
  
  it('validate one file esp to activate button', () => {
    component.onefileEsp(true);
    expect(component.oneEspFile).toBeTruthy();
  });

  it('add submodule', () => {
    component.addSubmodule();
    expect(component.activeAddSubmodule).toBeTruthy();
  });

  it('changeValue with values', () => {
    component.changeValue();
    component.createModule.controls.moduleName.setValue('prueba');
    component.createModule.controls.subModuleName.setValue('prueba');
    expect(component.activeAddSubmodule).toBeFalsy();
  });

  it('changeValue without values', () => {
    component.changeValue();
    component.createModule.controls.moduleName.setValue('');
    component.createModule.controls.subModuleName.setValue('');
    expect(component.activeAddSubmodule).toBeTruthy();
  });

  it('changeValueModuleName with values', () => {
    component.changeValueModuleName();
    component.createModule.controls.moduleName.setValue('prueba');
    component.createModule.controls.subModuleName.setValue('prueba');
    expect(component.activeSave).toBeTruthy();
  });
  
  

});
