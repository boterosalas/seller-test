import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadButtonComponent } from './upload-button.component';
import { MatIconModule } from '@angular/material';
import { By } from '@angular/platform-browser';

describe('UploadButtonComponent', () => {
  let component: UploadButtonComponent;
  let fixture: ComponentFixture<UploadButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadButtonComponent],
      imports: [MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

/*   it('should render the name of attached', async(() => {

    const file = {
      lastModified: 1,
      lastModifiedDate: new Date(),
      name: 'FileName.txt',
      size: 30000,
      type: 'String',
      webkitRelativePath: 'String',
      base64: 'String'
    };

    component.attachments.push(file);

    const compiled = fixture.debugElement.query(By.css('#attached-file-name'));
    console.log(compiled);
    fixture.detectChanges();
    expect(compiled).toBe(file.name);
  })); */

});
