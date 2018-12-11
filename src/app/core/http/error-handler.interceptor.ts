import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Logger } from '../util/logger.service';
import { RoutesConst } from '@app/shared/util/routes.constants';
import { DialogTokenExpiredComponent } from './dialog-token-expired/dialog-token-expired';
import { UserLoginService } from '../aws-cognito';


const log = new Logger('ErrorHandlerInterceptor');

/**
 * Agrega un manejador de error predeterminado a todas las solicitudes.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  public firstTime = true;
  public errorToken = 'The incoming token has expired'; // Error de AWS que indica la finalización del token.
  constructor(private snackBar: MatSnackBar, private router: Router, public dialog: MatDialog,
    public userService: UserLoginService) {
  }

  public changeFirstTime(): void {
  }

  /**
   * Abre el dialogo para finalizar sesion siempre y cuando el token este expirado.
   *
   * @memberof ErrorHandlerInterceptor
   */
  openDialog(): void {
    this.userService.logout();
    const dialogRef = this.dialog.open(DialogTokenExpiredComponent, {
      width: '30%',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firstTime = true;
        this.router.navigate([`/${RoutesConst.sellerCenterLogout}`]);
      }
    });
  }


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  private errorHandler(error: HttpEvent<any>): Observable<HttpEvent<any>> {
    let message: string;
    let tokenExpired = false;

    if (error instanceof HttpErrorResponse) {

      // Valida si hay error y si el error tiene como mensaje que finalizo la sesión.
      if (error && error.error.message === this.errorToken && this.firstTime) {
        tokenExpired = true;
      }
      // Ha ocurrido un error en el servidor o la conexión.
      if (!navigator.onLine) {
        // Gestionar error offline.
        message = 'Parece que no estas conectado a una red.';
        this.snackBar.open('Error en la red, Parece que no estás conectado a internet, por favor verifica tu conexión.', 'Cerrar', {
          duration: 3000,
        });
      } else if (!tokenExpired) {
        // Manejar Http Error (error.status === 403, 404 ...)
        message = 'Hubo un problema en la petición HTTP:';
        this.snackBar.open('Se produjo un error al realizar la petición al servidor.', 'Cerrar', {
          duration: 3000,
        });
      }
      // Mostrar dialogo que el token expiro
      if (tokenExpired) {
        this.openDialog();
        this.firstTime = false;
      }
    } else {
      // Manejar errores del cliente (Angular Error, ReferenceError...)
      message = 'Algo anda mal en el cliente:';
      this.snackBar.open('No se pudo realizar la petición al servidor, Ocurrió un error.', 'Cerrar', {
        duration: 3000,
      });
    }
    log.error(`${message} `, error);

    throw error;
  }
}
