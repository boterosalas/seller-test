import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateNoGtm'
})
export class DateNoGtmPipe implements PipeTransform {
  transform(date: string): string {
    const timezone = new Date().getTimezoneOffset();
    const time = new Date(date).getTime(); // new Date('2019-02-03T00:42:06.177+00:00').getTime();
    const dateWithOutUTC = new Date(time + timezone * 60 * 1000);
    return dateWithOutUTC.toUTCString();
  }
}
