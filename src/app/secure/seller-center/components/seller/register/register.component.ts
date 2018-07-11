import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ModelRegister } from './models/register.model';
import { RegisterService } from './register.service';
import { ShellComponent } from '../../../shell/shell.component';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [RegisterService]
})


export class RegisterSellerComponent implements OnInit {

  /*
    * Inicio Modificacion de estilos por pragma.com.co
    * @author Jose Fernan Banguera 16/05/2018
    * Modificamos la ruta de las url en dos arreglos:
    *  1.es la url que esta directo, renderiza a las imagenes en las plantilla. (solo para la carga inicial de las urls iniciales. )
    *  2. El segundo guarda la informacion de las rutas cuando hacemos o quitamos el checkbox.
  */
  public imagesSrc: Array<any> = [
    '../../../../../assets/seller-register/logo_exito_check.jpg',
    '../../../../../assets/seller-register/logo_carulla.jpg',
    '../../../../../assets/seller-register/logo_mis_catalogos_check.jpg'
  ];
  public imagesRegister: Array<any> = [
    {
      checked: '../../../../../assets/seller-register/logo_exito_check.jpg',
      unchecked: '../../../../../assets/seller-register/logo_exito.jpg'
    },
    {
      checked: '../../../../../assets/seller-register/logo_carulla_check.jpg',
      unchecked: '../../../../../assets/seller-register/logo_carulla.jpg'
    },
    {
      checked: '../../../../../assets/seller-register/logo_mis_catalogos_check.jpg',
      unchecked: '../../../../../assets/seller-register/logo_mis_catalogos.jpg'
    }
  ];

  public values = '';
  public existValueInDB: boolean;
  public formRegister: ModelRegister;
  matcher: MyErrorStateMatcher;
  validateFormRegister: FormGroup;
  public idState: number;
  public daneCode: any;
  public disabledForService: boolean;
  public emailRegex = /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i;

  /**
   * Creates an instance of RegisterSellerComponent.
   * @param {registerService} registerService
   * @param {shellComponent} shellComponent
   */
  constructor(
    @Inject(RegisterService)
    private registerService: RegisterService,
    public shellComponent: ShellComponent,
  ) {
    this.formRegister = new ModelRegister(null, null, '', '', '', '', '', '', null, null, '', false, true, true, false, true);
  }

  ngOnInit() {
    this.validateFormRegister = new FormGroup({
      nit: new FormControl('', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[0-9]*$')
      ]),
      rut: new FormControl
        ('', [Validators.required,
        Validators.maxLength(20),
        Validators.pattern('^[0-9]*$')
        ]),
      contacto: new FormControl
        ('', [Validators.required,
        Validators.pattern('^[0-9A-Za-zá é í ó ú ü ñ  à è ù ë ï ü â ê î ô û ç Á É Í Ó Ú Ü Ñ  À È Ù Ë Ï Ü Â Ê Î Ô Û Ç]*$')
        ]),
      telefono: new FormControl
        ('', [Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
        Validators.pattern('^[0-9]*$')]),
      email: new FormControl
        ('', [Validators.required,
        Validators.pattern(this.emailRegex)
        ]),
      nomTienda: new FormControl
        ('', [Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern('^((?! .com$)(?! .co$)(?! .net$)(?! .gov$)(?! .edu$)(?! S.A.S$)(?! S.A$)(?! SA$)(?! SAS$)(?! s.a.s$)(?! sa.s$)(?! s.as$)(?! sas$)(?! s.a.$)(?! S.a.S$)(?! s.a.S$)(?! s.a$)(?! S.a.$)(?! LTDA$)(?! ltda$)(?! Ltda$)(?! LTDA.$)(?! ltda.$)(?! lTDA$)(?! ltDA$)(?! ltdA$)(?! lTda$)(?! ltDa$)(?! lTDa$)(?! LTda$)(?! LtDa$).)*$')]),
      direccion: new FormControl
        ('', [Validators.required]),
      codDane: new FormControl
        ('', [Validators.required]),
      logisticExito: new FormControl,
      enviosExito: new FormControl,
      goToExito: new FormControl,
      goToCarulla: new FormControl,
      goToCatalogo: new FormControl
    });
    this.matcher = new MyErrorStateMatcher();
  }

  /**
   *
   * @param e
   * @param num
   * @memberof RegisterSellerComponent
   */
  changeImageColor(e, num) {
    /* La 'e' se trae el elemento que se esta ejecutando en el DOM de html de angular.
    Le enviamos la posicion desde HTML[num] */
    if (e.checked) {
      this.imagesSrc[num] = this.imagesRegister[num].checked;
    } else {
      this.imagesSrc[num] = this.imagesRegister[num].unchecked;
    }

  }

  /**
   * @method keyPress que permite solo el ingreso de números
   * @param event
   * @memberof RegisterSellerComponent
   */
  keyPress(event: any) {
    const pattern = /[0-9 ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**
   * @method submitSellerRegistrationForm para registrar al usuario
   * @memberof RegisterSellerComponent
   */
  submitSellerRegistrationForm() {
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    this.disabledForService = true;
    this.registerService.registerUser(JSON.stringify(this.formRegister))
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const data = JSON.parse(result.body.body);
            if (data.Data) {
              this.shellComponent.modalComponent.showModal('success');
            } else if (!data.Data) {
              this.shellComponent.modalComponent.showModal('error');
            }
          } else {
            this.shellComponent.modalComponent.showModal('errorService');
          }

          this.disabledForService = false;
          this.shellComponent.loadingComponent.closeLoadingSpinner();

        }
      );
  }

  /**
   *
   * @method Metodo para validar si existe el parametro despues de cambiar el focus del input
   * @param {*} event
   * @memberof RegisterSellerComponent
   */
  validateExist(event: any, param: string) {
    const jsonExistParam = event.target.value;
    // tslint:disable-next-line:quotemark
    if (jsonExistParam !== "" && jsonExistParam !== '' && jsonExistParam !== undefined && jsonExistParam !== null) {
      this.shellComponent.loadingComponent.viewLoadingSpinner();
      this.disabledForService = true;
      this.registerService.fetchData(JSON.parse(JSON.stringify(jsonExistParam.replace(/\ /g, '+'))), param)
        .subscribe(
          (result: any) => {
            if (result.status === 200) {
              const data_response = JSON.parse(result.body.body);
              this.existValueInDB = data_response.Data;
              switch (param) {
                case 'nit':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNitDB': data_response.Data });
                  }
                  break;
                case 'email':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistEmailDB': data_response.Data });
                  }
                  break;
                case 'nomTienda':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNameDB': data_response.Data });
                  }
                  break;
                default:
              }
              this.disabledForService = false;
              this.shellComponent.loadingComponent.closeLoadingSpinner();
            } else {
              this.shellComponent.modalComponent.showModal('errorService');
              this.disabledForService = false;
              this.shellComponent.loadingComponent.closeLoadingSpinner();
            }
          }
        );
    }
  }

  /**
   * @method receiveDataState Metodo para obtener la data de departamento.
   * @param
   * @memberof RegisterSellerComponent
   */
  receiveDataState($event) {
    if ($event && $event !== undefined && $event !== null) {
      this.idState = $event.Id;
      this.formRegister.State = $event.Name;
    }
  }

  /**
   * @method receiveDataCitie Metodo para obtener la data de la ciudad.
   * @param
   * @memberof RegisterSellerComponent
   */
  receiveDataCitie($event) {
    if ($event && $event !== undefined && $event !== null) {
      this.formRegister.DaneCode = $event.DaneCode;
      this.formRegister.City = $event.Name;
      this.formRegister.SincoDaneCode = $event.SincoDaneCode;
    } else {
      this.formRegister.DaneCode = null;
    }
  }
}

