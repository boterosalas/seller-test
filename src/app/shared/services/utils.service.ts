import { Injectable } from '@angular/core';
import { UserInformation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getShortName(user: UserInformation) {
    const name = user.sellerName;
    const splitName = name.split(' ');
    if (splitName.length > 1) {
      return `${splitName[0][0]}${splitName[1][0]}`.toLocaleUpperCase();
    } else {
      return `${splitName[0][0]}${splitName[0][1]}`.toLocaleUpperCase();
    }
  }
}
