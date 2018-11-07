import { Injectable } from '@angular/core';
const numberOfServices = 4;

@Injectable()
export class QuotingAdminService {

  private counterServices = 0;

  constructor() {
  }

  /**
   * Get a boolean value if a number and counter of services is the same.
   */
  public getNumberOfService(): boolean {
    this.addToNumber();
    return this.counterServices >= numberOfServices;
  }

  /**
   * Plus to counter one unitity
   */
  public addToNumber(): number {
    return this.counterServices ++;
  }
}
