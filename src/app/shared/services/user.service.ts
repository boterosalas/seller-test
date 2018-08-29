
/* 3rd party components */
import { Injectable } from '@angular/core';
// tslint:disable-next-line:import-blacklist

/* our own custom components */
import { Logger } from './logger.service';


// log component
const log = new Logger('UserService');

@Injectable()

export class UserService {

    public userData: any;
    /**
     * Creates an instance of UserService.
     * @memberof UserService
     */
    constructor() { }

    /**
     * Método para obtener los datos del usuario
     * @returns
     * @memberof UserService
     */
    getUser() {
        return this.userData;
    }

    /**
     *
     * @param data
     */
    setUser(data) {
        this.userData = data;
    }
}
