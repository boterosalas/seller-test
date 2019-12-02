import { Injectable } from '@angular/core';
import { Observable, Subscriber, from } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { File } from './configuration.model';

@Injectable({
  providedIn: 'root'
})
export class UploadButtonService {
  constructor() {}

  public base64FromArray(files: Array<File>): Observable<File> {
    return from(files).pipe(
      flatMap((file: File) =>
        this.getBase64(file).pipe(
          map(base64 => Object.assign(file, { base64 }))
        )
      )
    );
  }

  public getBase64(file: any): Observable<any> {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Observable(
      (observer: Subscriber<string | ArrayBuffer | null>): void => {
        reader.onload = () => {
          observer.next(reader.result);
          observer.complete();
        };
        reader.onerror = error => observer.error(error);
      }
    );
  }
}
