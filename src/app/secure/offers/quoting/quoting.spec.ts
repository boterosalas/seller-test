import { async } from '@angular/core/testing';
import { QuotingComponent } from './quoting.component';
import { UserLoginService, UserParametersService } from '@app/core';
import { UserInformation } from '@app/shared/models';
import { Router } from '@angular/router';

describe('QuotingComponent', () => {


  const userMock = new UserInformation();
  userMock.sellerId = '1';
  userMock.sellerProfile = 'seller';
  userMock.sellerName = 'test';
  userMock.sellerNit = '1';
  userMock.sellerEmail = 'unitTest@test.com';

  /**
   *  Mock with user login service only need DONT THROW the excepetion if isnt login.
   * Service can't get a real test, because we cant use http request.
   */
  const userLoginService = <UserLoginService>{
    isAuthenticated(param: any) {
      return null;
    }
  };

  const userParams = <UserParametersService> {
    getUserData(): Promise<UserInformation> {
      return new Promise<UserInformation>(async (resolve) => {
        resolve(userMock);
    });
    }
  };


  const router = <Router>{
    navigate(commands: any[], extras?: any): Promise<boolean> {
      return new Promise(resolve => {
        resolve(true);
      });
    }
  };

  let component: QuotingComponent;

  beforeEach(async(() => {
    component = new QuotingComponent(userLoginService, router, userParams);
  }));

  it('should create QuotingComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should not get error initializate component', () => {
    expect(component.ngOnInit()).toBeUndefined();
  });

  it('should get a user log info, and get by user this rol "seller"', () => {
    component.isLoggedIn('', true).then(data => {
      expect(component.user.sellerId).toBe(userMock.sellerId);
      expect(component.userRol).toBe('Cotizador vendedor');
    });
  });

  it('should get a user log info, and get by user this rol "administrator"', () => {
    userMock.sellerProfile = 'administrator';
    component.isLoggedIn('', true).then(data => {
      expect(component.user.sellerId).toBe(userMock.sellerId);
      expect(component.userRol).toBe('Cotizador administrador');
    });
  });

  it('should get a user log info, and get by user this rol "null"', () => {
    userMock.sellerProfile = 'null';
    component.isLoggedIn('', true).then(data => {
      expect(component.user.sellerId).toBe(userMock.sellerId);
      expect(component.userRol).toBeNull();
    });
    component.isLoggedIn('', false);
  });




});
