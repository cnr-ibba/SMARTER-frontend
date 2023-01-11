import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textToColumn'
})
export class TextToColumnPipe implements PipeTransform {

  transform(value: any, column=60): string {
    let tmp: string[] = [];
    let result: string;

    for (let i = 0; i < value.length; i++ ) {
      tmp.push(value[i]);
      if ((i+1) % column == 0) {
        tmp.push("<br>");
      }
    }
    result = tmp.join('');
    return result;
  }

}
