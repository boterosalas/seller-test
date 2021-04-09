import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "flexSize"
})
export class FlexSizePipe implements PipeTransform {
  transform(value: number, args?: any): string {
    return value + "%";
  }
}
