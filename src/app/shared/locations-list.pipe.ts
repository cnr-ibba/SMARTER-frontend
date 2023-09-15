import { Pipe, PipeTransform } from '@angular/core';

import { Multipoint } from '../samples/samples.model';

@Pipe({
  name: 'locationsList'
})
export class LocationsListPipe implements PipeTransform {

  transform(value: Multipoint): string[] {
    let result: string[] = [];

    value.coordinates.forEach(position => {
      result.push(`latitude: ${position[1]}, longitude: ${position[0]}`);
    });

    return result;
  }

}
