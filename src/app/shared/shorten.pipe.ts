import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
  // inspired from https://stackoverflow.com/a/46455994
  transform(value: any, limit = 25, completeWords = false, ellipsis = '...') {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }

    return value.length > limit ? value.substr(0, limit) + ellipsis : value;
  }
}
