import * as moment from 'moment';

export class DateService {
    static getDateFormatToRequest(date: Date): string {
        const format = 'MM/DD/YYYY';
        const stringDate = moment(date).format(format).toString();
        return stringDate;
    }

    static getDateFormatToShow(date: Date): string {
        const format = 'DD/MM/YYYY';
        const stringDate = moment(date).utc().format(format).toString();
        return stringDate;
    }

    static stringToDate(date: string, format: string = 'DD/MM/YYYY'): Date {
        const dateFormat = moment(date, format);
        return dateFormat.toDate();
    }

    static getTomorrowDate(): Date {
        const tomorrow =  moment().utc().add(1, 'days').format('DD/MM/YYYY');
        return this.stringToDate(tomorrow);
    }
}
