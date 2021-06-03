import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeTags'
})
export class RemoveTagsPipe implements PipeTransform {

  transform(value: any): any {
    let replace = value.replace(/<[^>]+>/g, '');
    return replace;
  }

}
