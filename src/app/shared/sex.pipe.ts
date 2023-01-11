import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sex2string'
})
export class SexToStringPipe implements PipeTransform {

  transform(value: string): string {
    let result = "Unknown";

    if (value == '1') {
      result = "Male";
    } else if (value == '2') {
      result = "Female";
    }

    return result;
  }

}
