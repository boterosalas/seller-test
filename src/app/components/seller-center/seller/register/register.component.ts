import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ModelRegister } from './models/register.model';
import { RegisterService } from './register.service';
import { ShellComponent } from '../../../../core/shell/shell.component';
import { User } from './../../../shared/models/login.model';
import { UserService } from '../../../../core/services/common/user/user.service';
import { Logger } from '../../../../core/utilities/logger.service';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';

const log = new Logger('RegisterComponent');

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


export class RegisterComponent implements OnInit {
  /* Información del usuario*/
  public user: User;

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
   * Creates an instance of RegisterComponent.
   * @param {registerService} registerService
   * @param {shellComponent} shellComponent
   * @param {UserService} userService
   */
  constructor(
    @Inject(RegisterService)
    private registerService: RegisterService,
    public shellComponent: ShellComponent,
    public userService: UserService,
  ) {
    this.formRegister = new ModelRegister(null, null, '', '', '', '', '', '', null, null, '', false, true, true, false, true);
  }

  ngOnInit() {
    /* Funcionalidad para validar el acceso del usuario.
    Valido si el usuario se encuentra logeado y puede ingresar a la vista. */
    // this.shellComponent.validateAccesUser().subscribe(res => {
    this.user = this.userService.getUser();
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
        // tslint:disable-next-line:max-line-length
        Validators.pattern(this.emailRegex)
        ]),
      nomTienda: new FormControl
        ('', [Validators.required,
        // tslint:disable-next-line:max-line-length
        Validators.pattern('^((?!.com)(?!.co)(?!.net)(?!.gov)(?!.edu)(?!S.A.S)(?!S.A)(?!SA)(?!SAS)(?!s.a.s)(?!sa.s)(?!s.as)(?!sas)(?!s.a.)(?!S.a.S)(?!s.a.S)(?!s.a)(?!S.a.)(?!LTDA)(?!ltda)(?!Ltda)(?!LTDA.)(?!ltda.)(?!lTDA)(?!ltDA)(?!ltdA)(?!lTda)(?!ltDa)(?!lTDa)(?!LTda)(?!LtDa).)*$')]),
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
   * @memberof RegisterComponent
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
   * @memberof RegisterComponent
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
   * @memberof RegisterComponent
   */
  submitSellerRegistrationForm() {
    this.shellComponent.loadingComponent.viewLoadingSpinner();
    this.disabledForService = true;
    this.registerService.registerUser(JSON.stringify(this.formRegister))
      .subscribe(
        (result: any) => {
          if (result.status === 201 || result.status === 200) {
            const data = result;
            if (data.body.Data) {
              this.shellComponent.modalComponent.showModal('success');
            } else if (!data.body.Data) {
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
   * @memberof RegisterComponent
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
              const data = JSON.stringify(result);
              this.existValueInDB = result.body.Data;
              switch (param) {
                case 'nit':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNitDB': result.body.Data });
                  }
                  break;
                case 'email':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistEmailDB': result.body.Data });
                  }
                  break;
                case 'nomTienda':
                  if (this.existValueInDB) {
                    this.validateFormRegister.controls[param].setErrors({ 'validExistNameDB': result.body.Data });
                  }
                  break;
                default:
                  console.log('Hace falta parametro');
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
   * @memberof RegisterComponent
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
   * @memberof RegisterComponent
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

