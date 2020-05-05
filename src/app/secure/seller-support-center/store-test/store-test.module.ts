import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { of, Observable } from 'rxjs';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class StoreTestModule {

  store(): Observable<any> {
    return of([]);
  }
}
