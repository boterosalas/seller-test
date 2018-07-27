/* 3rd party components */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { AwsCognitoModule } from '../../../app.module';
import { RouterTestingModule } from '@angular/router/testing';

/* our own custom components */
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        // AwsCognitoModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
